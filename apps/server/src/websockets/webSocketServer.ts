import { createServer } from "http";
import Redis from "ioredis";
import { WebSocket, WebSocketServer as WSServer } from "ws";
import { parse as parseUrl } from 'url';
import jwt from "jsonwebtoken";
import { WebSocketMessage } from "./types";

export class WebSocketserver {
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

    private handleIncomingMessage(ws: WebSocket, data: string, userData: any) {
        const message: WebSocketMessage = JSON.parse(data);
    }

}