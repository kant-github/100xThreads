import { createServer, Server } from "http";
import { WebSocket, WebSocketServer as WSServer } from "ws";
import { parse as parseUrl } from 'url';
import Redis from "ioredis";
import WebSocketDatabaseManager from "./WebSocketDatabaseManager";
import prisma from "@repo/db/client";

export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: number;
    senderId?: string;
}

export interface ChannelSubscription {
    channelId: string;
    organizationId: string;
    type: string;
}

export default class WebSocketServerManager {

    private wss: WSServer;
    private databaseManager: WebSocketDatabaseManager;
    private publisher: Redis;
    private subscriber: Redis;
    private clients: Map<String, Set<WebSocket>> = new Map();
    private userSubscriptions: Map<WebSocket, Set<string>> = new Map();

    constructor(server: Server) {
        this.wss = new WSServer({ server });

        this.publisher = new Redis(process.env.LOCAL_REDIS_URL || "redis://localhost:6379")

        this.subscriber = new Redis(process.env.LOCAL_REDIS_URL || "redis://localhost:6379")

        this.databaseManager = new WebSocketDatabaseManager(prisma, this.publisher);
        this.initialize();
    }

    private initialize() {

        this.wss.on('connection', async (ws: WebSocket, req) => {
            try {
                const token = this.extractToken(req);
                const tokenData = await this.authenticateUser(token);
                if (!tokenData) {
                    ws.close(4001, 'Unauthenticated user');
                    return;
                }

                this.setupClientTracking(ws, tokenData);

                ws.on('message', (data: string) => {
                    this.handleIncomingMessage(ws, data, tokenData);
                })

                ws.on('close', () => {
                    this.handleClientDisconnect(ws);
                });

            } catch (err) {
                console.error('Connection error:', err);
                ws.close(4002, 'Connection setup failed');
            }
        })

        this.subscriber.on('message', (channelKey, message) => {
            this.handleRedisMessage(channelKey, message);
        })
    }


    private setupClientTracking(ws: WebSocket, tokenData: any) {
        const organizationId = tokenData.organizationId
        if (!this.clients.has(organizationId)) {
            this.clients.set(organizationId, new Set());
        }

        (ws as any).tokenData = tokenData;

        this.clients.get(organizationId)!.add(ws);
        this.userSubscriptions.set(ws, new Set());
    }


    private async handleIncomingMessage(ws: WebSocket, data: string, tokenData: any) {
        const message: WebSocketMessage = JSON.parse(data);
        switch (message.type) {
            case 'subscribe-channel':
                await this.handleChannelSubscription(ws, message.payload);
                break;
            case 'unsubscribe-channel':
                await this.handleChannelUnsubscription(ws, message.payload);
                break;
            default:
                try {
                    await this.databaseManager.handleIncomingMessage(message, tokenData);
                } catch (error) {
                    console.error('Message processing error:', error);
                }
        }
    }

    private async handleChannelSubscription(ws: WebSocket, subscription: ChannelSubscription) {

        const channelKey: string = this.getChannelKey(subscription);
        this.userSubscriptions.get(ws)!.add(channelKey);
        await this.subscriber.subscribe(channelKey);

        this.sendToClient(ws, {
            type: 'subscription_confirmed',
            payload: subscription,
            timestamp: Date.now()
        })
    }

    private handleRedisMessage(channelKey: string, message: string) {
        const parsedMessage = JSON.parse(message);
        const [organizationId] = channelKey.split(':');

        const clients = this.clients.get(organizationId!);
        if (!clients) return;

        for (const client of clients) {
            if (this.userSubscriptions.get(client)?.has(channelKey)) {
                const clientData = (client as any).tokenData;
                if (clientData && clientData.userId !== parsedMessage.userId) {
                    this.sendToClient(client, parsedMessage);
                }
            }
        }
    }

    private async handleChannelUnsubscription(ws: WebSocket, subscription: ChannelSubscription) {
        const channelKey = this.getChannelKey(subscription);
        this.userSubscriptions.get(ws)!.delete(channelKey);

        let hasOtherSubscribers = false;
        for (const subscribers of this.userSubscriptions.values()) {
            if (subscribers.has(channelKey)) {
                hasOtherSubscribers = true;
                break;
            }
        }
        if (!hasOtherSubscribers) {
            await this.subscriber.unsubscribe(channelKey);
        }
    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }

    private parseChannelKey(key: string): ChannelSubscription {

        const [organizationId, channelId, type] = key.split(':');

        if (!organizationId || !channelId || !type) {
            throw new Error('Invalid channel key format');
        }

        return {
            organizationId,
            channelId,
            type: type as any
        };
    }

    private handleClientDisconnect(ws: WebSocket) {

        const subscriptions = this.userSubscriptions.get(ws);
        if (subscriptions) {
            for (const channelKey of subscriptions) {
                this.handleChannelUnsubscription(ws, this.parseChannelKey(channelKey));
            }
        }

        this.userSubscriptions.delete(ws);
        for (const clients of this.clients.values()) {
            clients.delete(ws);
        }
    }

    private sendToClient(ws: WebSocket, message: WebSocketMessage) {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message))
        }
    }

    private async authenticateUser(token: string) {
        try {
            const decodedString = Buffer.from(token, 'base64').toString();
            const tokenData = JSON.parse(decodedString);

            if (!tokenData.userId || !tokenData.organizationId) {
                throw new Error('Invalid token structure');
            }

            return tokenData;
        } catch (err) {
            console.error('Authentication error:', err);
            return null;
        }
    }


    private extractToken(req: any) {
        const url = parseUrl(req.url!, true);
        const token = url.query.token;
        return token as string;
    }

}