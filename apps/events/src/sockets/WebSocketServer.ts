import { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid';
import { parse as parseUrl } from 'url';
import { PrismaClient } from ".prisma/client";
import prisma from '@repo/db/client';
import FriendsChannelManager from './abstractions/FriendsChannelManager';
import P2pChatsManager from './abstractions/P2pChatsManager';

interface TokenData {
    userId: string;
    userName: string;
}

interface ChannelSubscription {
    key: string,
    type: string
}

interface WebSocketClient extends WebSocket {
    id: string;
    userId?: string;
    isAlive: boolean;
    subscribedChannels: Set<string>;
}

interface Channel {
    key: string;
    type: string;
}

interface Message {
    type: string;
    payload: any;
}

export default class WebSocketServerManager {
    private wss: WebSocketServer;
    private clients: Map<string, WebSocketClient> = new Map(); // All connected clients by socketId
    private userSockets: Map<string, Set<string>> = new Map(); // userId -> set<ws.id>
    private channels: Map<string, Set<string>> = new Map(); // channelKey -> set<ws.id>
    private prisma: PrismaClient;
    private friendsChannelManager: FriendsChannelManager;
    private p2pChatsManager: P2pChatsManager;
    private pingInterval: NodeJS.Timeout | null = null;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.prisma = prisma;
        this.initializeConnection();
        this.friendsChannelManager = new FriendsChannelManager(this.prisma);
        this.p2pChatsManager = new P2pChatsManager(this.prisma);
    }

    private initializeConnection() {
        this.wss.on('connection', async (ws: WebSocketClient, req) => {
            const token: string = this.extractToken(req);
            const tokenData: TokenData | null = await this.authenticateUser(token);

            if (!tokenData) {
                ws.close(1008, 'Authentication failed');
                return;
            }

            ws.id = uuidv4();
            ws.isAlive = true;
            ws.subscribedChannels = new Set();
            this.clients.set(ws.id, ws);
            this.initTracking(ws, tokenData);

            ws.on('message', (data) => {
                this.handleIncomingMessage(ws, data);
            });

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('close', () => {
                this.handleDisconnection(ws);
            });
        });
    }

    private handleIncomingMessage(ws: WebSocketClient, rawData: any) {
        try {
            const message = JSON.parse(rawData.toString());
            const { type, payload } = message;

            switch (type) {
                case 'subscribe-channel':
                    this.handleSubscription(ws, payload);
                    break;
                case 'unsubscribe-channel':
                    this.handleUnsubscription(ws, payload);
                    break;
                default:
                    this.handleCustomMessage(ws, type, message);
            }
        } catch (error) {
            console.error("Error handling incoming message:", error);
        }
    }

    private handleSubscription(ws: WebSocketClient, payload: any) {
        const { key, type } = payload;
        if (!key || !type) {
            return;
        }

        const channelKey = this.getChannelKey({ key, type });
        ws.subscribedChannels.add(channelKey);
        if (!this.channels.has(channelKey)) {
            this.channels.set(channelKey, new Set());
        }
        this.channels.get(channelKey)?.add(ws.id);


        ws.send(JSON.stringify({
            type: 'subscription-confirmed',
            data: { key, type }
        }));
    }

    private handleUnsubscription(ws: WebSocketClient, payload: any) {
        const { key, type } = payload;
        if (!key || !type) {
            return;
        }

        const channelKey = `${key}:${type}`;

        ws.subscribedChannels.delete(channelKey);

        const channelSubscribers = this.channels.get(channelKey);
        if (channelSubscribers) {
            channelSubscribers.delete(ws.id);
            if (channelSubscribers.size === 0) {
                this.channels.delete(channelKey);
            }
        }


        ws.send(JSON.stringify({
            type: 'unsubscription-confirmed',
            data: { key, type }
        }));
    }

    private async handleCustomMessage(ws: WebSocketClient, type: string, message: any) {

        switch (type) {
            case 'accept-friend-request': {
                const data = await this.friendsChannelManager.handleIncomingFriendRequest(message);
                if (data.user1.userId) {
                    this.sendToUser(String(data.user1.userId), type, data.user1.data);
                }
                if (data.user2.userId) {
                    this.sendToUser(String(data.user2.userId), type, data.user2.data);
                }
                break;
            }
            case 'send-friend-request': {
                const data = await this.friendsChannelManager.addFriendHandler(message);
                if (data?.user1.userId) {
                    this.sendToUser(String(data.user1.userId), type, data.user1.data);
                }
                break;
            }

            case 'new-message-p2p': {
                const data = await this.p2pChatsManager.handleIncomingNewMessage(message);
                const key = message.payload.key;
                this.broadcastToChannel(key, type, data);
                break;
            }

            case 'typing-event': {
                const data = this.p2pChatsManager.handleIncomingTypingEvents(message);
                const key = message.payload.key;
                this.broadcastToChannel(key, type, data, ws.id);
                break;
            }

            default:
                console.warn("Unknown message type:", type);
        }

    }

    private initTracking(ws: WebSocketClient, tokenData: TokenData) {
        const userId = tokenData.userId;
        ws.userId = userId;

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)?.add(ws.id);

        this.sendToClient(ws, {
            type: "CONNECTED",
            data: {
                message: "You are connected",
                userId: userId,
                userName: tokenData.userName
            }
        });
    }

    private sendToClient(client: WebSocketClient, data: any) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    public sendToUser(userId: string, type: string, data: any) {
        console.log("sending");
        const userConnections = this.userSockets.get(userId);
        console.log("user connected for the user id " + userId + " is : ", userConnections?.size);
        if (!userConnections || userConnections.size === 0) {
            return false;
        }
        const messagePayload = {
            type,
            data
        }

        const message = JSON.stringify(messagePayload);
        let sentCount = 0;

        userConnections.forEach((socketId) => {
            const client = this.clients.get(socketId);
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(message);
                sentCount++;
            }
        });

        return sentCount > 0;
    }

    public broadcastToChannel(key: string, type: string, data: any, excludeSocketId?: string) {

        console.log("data is ---------------------- >", data);
        const channelKey = `${key}:${type}`;

        const messagePayload = {
            type,
            data
        }

        const channelSubscribers = this.channels.get(channelKey);
        console.log("length is : ", channelSubscribers?.size);
        if (!channelSubscribers || channelSubscribers.size === 0) {
            return false;
        }

        const message = JSON.stringify(messagePayload);
        let sentCount = 0;

        channelSubscribers.forEach((socketId) => {
            if (excludeSocketId && socketId === excludeSocketId) return;
            const client = this.clients.get(socketId);
            if (client && client.readyState === WebSocket.OPEN) {
                console.log("message at last is : ", message);
                console.log("and sent to user id : ", client.userId);
                client.send(message);
                sentCount++;
            }
        });

        return sentCount > 0;
    }

    public broadcastToAll(data: any) {
        const message = JSON.stringify(data);
        let sentCount = 0;

        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                sentCount++;
            }
        });

        return sentCount > 0;
    }

    private handleDisconnection(ws: WebSocketClient) {

        if (ws.userId) {
            const userConnections = this.userSockets.get(ws.userId);
            if (userConnections) {
                userConnections.delete(ws.id);
                if (userConnections.size === 0) {
                    this.userSockets.delete(ws.userId);
                }
            }
        }

        ws.subscribedChannels.forEach((channelKey) => {
            const channelSubscribers = this.channels.get(channelKey);
            if (channelSubscribers) {
                channelSubscribers.delete(ws.id);
                if (channelSubscribers.size === 0) {
                    this.channels.delete(channelKey);
                }
            }
        });

        this.clients.delete(ws.id);
    }

    private extractToken(req: any) {
        const url = parseUrl(req.url!, true);
        return url.query.token as string;
    }

    private async authenticateUser(token: string): Promise<TokenData | null> {
        try {
            if (!token) {
                console.error('No token provided');
                return null;
            }

            const decodedString = Buffer.from(token, 'base64').toString();
            const tokenData = JSON.parse(decodedString);

            if (!tokenData || !tokenData.userId) {
                console.error('Invalid token structure');
                return null;
            }
            return tokenData;
        } catch (err) {
            console.error('Authentication error:', err);
            return null;
        }
    }

    public shutdown() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }


        this.clients.forEach((client) => {
            client.terminate();
        });

        this.wss.close();
    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.key}:${subscription.type}`
    }
}