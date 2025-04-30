import { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid';
import { parse as parseUrl } from 'url';

interface TokenData {
    userId: string;
    userName: string;
}

interface WebSocketClient extends WebSocket {
    id: string;
    userId?: string;
    isAlive: boolean;
}

interface PayloadInterface {
    userId: string;
    type: string;
    payload: any;
}

export default class WebSocketServerManager {

    private wss: WebSocketServer;
    private clients: Map<string, WebSocketClient> = new Map(); // All connected clients by socketId
    private userSockets: Map<string, Set<string>> = new Map(); // userId, set<ws.id>

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.initializeConnection();
    }

    private initializeConnection() {
        this.wss.on('connection', async (ws: WebSocketClient, req) => {
            console.log("client connected");
            const token: string = this.extractToken(req);
            const tokenData: TokenData = await this.authenticateUser(token);
            console.log("token is : ", tokenData);

            ws.id = uuidv4();
            ws.isAlive = true;
            this.clients.set(ws.id, ws);
            this.initTRacking(ws, tokenData)

            ws.on('message', (data: string) => {
                this.handleIncomingMessage(ws, data);
            })

            ws.on('close', () => {
                this.handleDisconnection(ws);
            });
        })
    };

    private initTRacking(ws: WebSocketClient, tokenData: TokenData) {
        const userId = tokenData.userId;
        ws.userId = userId;

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)?.add(ws.id);
        this.sendToUser(userId, "You are connected");
        console.log("user sockets is : ", this.userSockets);
        console.log("and : ", this.clients)
    }

    private handleIncomingMessage(ws: WebSocketClient, data: string) {
        const payload: PayloadInterface = JSON.parse(data);
        switch (payload.type) {
            case 'auth':
                this.handleClientTracking(ws, payload);
        }
    }

    private handleClientTracking(ws: WebSocketClient, payload: PayloadInterface) {
        const userId = payload.userId;
        ws.userId = userId;

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)?.add(ws.id);


        this.sendToUser(userId, "You are connected");
        console.log(this.userSockets);
        //send client confirmation ---------------------------------------- >
    }

    public sendToUser(userId: string, data: any) {
        console.log("data came is : ", data);
        const userConnections = this.userSockets.get(userId);

        if (!userConnections || userConnections.size === 0) {
            return;
        }
        const message = JSON.stringify(data);
        let sentCount = 0;

        userConnections.forEach((socketId) => {
            const client = this.clients.get(socketId);
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(message);
                sentCount++;
            }
        })

        console.log(`message sent to ${sentCount} active connection of userId : ${userId}`);
    }

    private handleDisconnection(ws: WebSocketClient) {
        console.log(`After disconnection ------------------------------------- > `, this.userSockets);
        if (ws.userId) {
            const userConnections = this.userSockets.get(ws.userId);
            userConnections?.delete(ws.id);

            if (userConnections?.size === 0) {
                this.userSockets.delete(ws.userId);
            }
            this.clients.delete(ws.id);
        }
    }

    private extractToken(req: any) {
        const url = parseUrl(req.url!, true);
        const token = url.query.token;
        return token as string;
    }

    private async authenticateUser(token: string) {
        try {

            const decodedString = Buffer.from(token, 'base64').toString();
            const tokenData = JSON.parse(decodedString);

            if (!tokenData) {
                throw new Error('Invalid token structure');
            }

            return tokenData;
        } catch (err) {
            console.error('Authentication error:', err);
            return null;
        }
    }
}