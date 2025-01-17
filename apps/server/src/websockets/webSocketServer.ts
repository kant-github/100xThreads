import { createServer } from "http";
import { WebSocket, WebSocketServer as WSServer } from "ws";
import { parse as parseUrl } from 'url';
import jwt from "jsonwebtoken";
import Redis from "ioredis";

interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: number;
}

interface ChannelSubscription {
    channelId: string;
    organizationId: string;
    type: 'messages'
}


export default class WebSocketserver {

    private wss: WSServer;
    private publisher: Redis;
    private subscriber: Redis;
    private clients: Map<String, Set<WebSocket>> = new Map();
    private userSubscriptions: Map<WebSocket, Set<string>> = new Map();

    constructor() {
        const server = createServer();
        this.wss = new WSServer({ server });

        // redis publisher initialization
        this.publisher = new Redis({
            port: 6379,
            host: 'localhost'
        })

        // redis subscriber initialization
        this.subscriber = new Redis({
            port: 6379,
            host: 'localhost'
        })

        this.initialize();
        server.listen(7001, () => {
            console.log(`App is listening at : ${7001}`)
        });
    }

    private initialize() {

        this.wss.on('connection', (ws: WebSocket, req) => {
            try {
                const token = this.extractToken(req);
                const userData = this.authenticateUser(token);

                if (!userData) {
                    ws.close(4001, 'Unauthenticated user');
                    return;
                }

                this.setupClientTracking(ws, userData);

                ws.on('message', (data: string) => {
                    this.handleIncomingMessage(ws, data, userData);
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

    private setupClientTracking(ws: WebSocket, userData: any) {
        const organizationId = userData.organizationId

        if (!this.clients.has(organizationId)) {
            this.clients.set(organizationId, new Set());
        }

        this.clients.get(organizationId)!.add(ws);
        this.userSubscriptions.set(ws, new Set());
    }

    private extractToken(req: any) {
        const url = parseUrl(req.url!, true);
        const token = url.query.token;
        return token as string;
    }

    private async authenticateUser(token: string) {
        try {
            return jwt.verify(token, "default_secret");
        } catch (err) {
            console.error('Authentication error:', err);
            return null;
        }
    }

    private async handleIncomingMessage(ws: WebSocket, data: string, userData: any) {
        const message: WebSocketMessage = JSON.parse(data);

        switch (message.type) {
            case 'subscribe-channel':
                await this.handleChannelSubscription(ws, message.payload);
            case 'unsubscribe-channel':
                await this.handleChannelUnsubscription(ws, message.payload);
            default:
                this.publishToredis(message, userData);
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
                this.sendToClient(client, parsedMessage);
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

    private publishToredis(message: WebSocketMessage, userData: any) {

        const channelKey = this.getChannelKey({
            organizationId: userData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: userData.userId,
            timeStamp: Date.now()
        }));

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
}