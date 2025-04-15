import { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'

interface WebSocketClient extends WebSocket {
    id: string;
    userId?: string;
    isAlive: boolean;
}

interface PayloadInterface {
    userId: string;
    type: string;
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
        this.wss.on('connection', (ws: WebSocketClient) => {
            ws.id = uuidv4();
            ws.isAlive = true;

            this.clients.set(ws.id, ws);
            console.log("socket client connected : ", ws.id);

            ws.on('message', (data: string) => {
                this.handleIncomingMessage(ws, data);
            })

            ws.on('close', () => {
                this.handleDisconnection(ws);
            });
        })
    };

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


        //send client confirmation ---------------------------------------- >
    }

    public sendToUser(userId: string, data: any) {
        const userConnections = this.userSockets.get(userId);

        if (!userConnections || userConnections.size === 0) {
            console.log("no user and its respective socket id exist");
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
        if (ws.userId) {
            const userConnections = this.userSockets.get(ws.userId);
            userConnections?.delete(ws.id);

            if (userConnections?.size === 0) {
                this.userSockets.delete(ws.userId);
            }
            this.clients.delete(ws.id);
            console.log`Client disconnected ${ws.id}`
        }
    }
}