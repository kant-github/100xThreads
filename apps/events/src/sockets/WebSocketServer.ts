import { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid';
import { parse as parseUrl } from 'url';
import { PrismaClient } from ".prisma/client";
import prisma from '@repo/db/client';
import FriendsChannelManager from './abstractions/FriendsChannelManager';

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
    subscribedChannels: Set<string>; // Track channels this client is subscribed to
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
    private pingInterval: NodeJS.Timeout | null = null;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.prisma = prisma;
        this.initializeConnection();
        this.friendsChannelManager = new FriendsChannelManager(this.prisma);
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

        console.log(`Client ${ws.id} subscribed to channel ${channelKey}`);

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

        console.log(`Client ${ws.id} unsubscribed from channel ${channelKey}`);

        // Confirm unsubscription to client
        ws.send(JSON.stringify({
            type: 'unsubscription-confirmed',
            data: { key, type }
        }));
    }

    private async handleCustomMessage(ws: WebSocketClient, type: string, message: any) {
        console.log(`Handling custom message : `, message);
        console.log("and type is : ", type);

        switch (type) {
            case 'friend-request-accept': {
                const data = await this.friendsChannelManager.handleIncomingFriendRequest(message);
                console.log("jahapnah data : ", data);
                if (ws.userId) {
                    this.sendToUser(ws.userId, type, data);
                }
                break;
            }

            // Handle other custom types here
            default:
                console.warn("Unknown message type:", type);
        }

    }

    private initTracking(ws: WebSocketClient, tokenData: TokenData) {
        console.log(`User ${tokenData.userId} (${tokenData.userName}) connected`);
        const userId = tokenData.userId;
        ws.userId = userId;

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)?.add(ws.id);

        // Send welcome message
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
        console.log(`Sending to user ${userId}:`, data);

        const userConnections = this.userSockets.get(userId);
        if (!userConnections || userConnections.size === 0) {
            console.log(`No active connections for user ${userId}`);
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

        console.log(`Message sent to ${sentCount}/${userConnections.size} connections`);
        return sentCount > 0;
    }

    public broadcastToChannel(key: string, type: string, data: any) {
        const channelKey = `${key}:${type}`;
        console.log(`Broadcasting to channel ${channelKey}:`, data);

        const channelSubscribers = this.channels.get(channelKey);
        if (!channelSubscribers || channelSubscribers.size === 0) {
            console.log(`No subscribers for channel ${channelKey}`);
            return false;
        }

        const message = JSON.stringify(data);
        let sentCount = 0;

        channelSubscribers.forEach((socketId) => {
            const client = this.clients.get(socketId);
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(message);
                sentCount++;
            }
        });

        console.log(`Message broadcast to ${sentCount}/${channelSubscribers.size} subscribers`);
        return sentCount > 0;
    }

    public broadcastToAll(data: any) {
        console.log("Broadcasting to all clients:", data);
        const message = JSON.stringify(data);
        let sentCount = 0;

        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                sentCount++;
            }
        });

        console.log(`Message broadcast to ${sentCount}/${this.clients.size} clients`);
        return sentCount > 0;
    }

    private handleDisconnection(ws: WebSocketClient) {
        console.log(`Client ${ws.id} disconnected`);

        // Clean up user tracking
        if (ws.userId) {
            const userConnections = this.userSockets.get(ws.userId);
            if (userConnections) {
                userConnections.delete(ws.id);
                if (userConnections.size === 0) {
                    this.userSockets.delete(ws.userId);
                }
            }
        }

        // Clean up channel subscriptions
        ws.subscribedChannels.forEach((channelKey) => {
            const channelSubscribers = this.channels.get(channelKey);
            if (channelSubscribers) {
                channelSubscribers.delete(ws.id);
                if (channelSubscribers.size === 0) {
                    this.channels.delete(channelKey);
                }
            }
        });

        // Remove client from clients map
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

            // Optional: Verify user existence in the database
            // const user = await this.prisma.user.findUnique({ where: { id: tokenData.userId } });
            // if (!user) return null;

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

        // Close all connections
        this.clients.forEach((client) => {
            client.terminate();
        });

        this.wss.close();
        console.log("WebSocket server shut down");
    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.key}:${subscription.type}`
    }
}