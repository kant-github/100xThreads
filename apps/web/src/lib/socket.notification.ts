import { NotificationType } from "types/types";

export default class WebSocketNotificationClient {
    private ws: WebSocket | null = null;
    private URL: string;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private messageHandlers: Map<String, ((payload: any) => void)[]> = new Map();

    constructor(URL: string) {
        this.URL = URL;
        this.connect();
    }

    private connect() {
        try {
            this.ws = new WebSocket(this.URL);

            this.ws.onopen = () => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
            }

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log("message is : ", message)
                    this.processNotification(message);
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            this.ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                this.attemptReconnect();
            };

        } catch (err) {
            throw new Error("Error in creating the notification web socket client");
        }
    }

    private processNotification(message: any) {
        const type: string = message.type;
        const notification: NotificationType = message.notification;

        const handlers = this.messageHandlers.get(type) || [];

        handlers.forEach(handler => {
            try {
                handler(notification);
            } catch (error) {
                console.error("Error in message handler:", error);
            }
        })
    }

    public subscribeToHandlers(type: String, handler: (payload: NotificationType) => void): () => void {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }

        const existingHandlers = this.messageHandlers.get(type);
        existingHandlers?.push(handler);

        return () => {
            const index = existingHandlers?.indexOf(handler);
            if (index !== -1) {
                existingHandlers?.splice(index!, 1);
            }
        };
    }


    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            this.reconnectTimeout = setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.error("Maximum reconnection attempts reached. Please check your server or network connection.");
        }
    }

    public close() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.ws) {
            this.ws.close(1000, "Closed by client");
            this.ws = null;
        }

        this.isConnected = false;
        this.messageHandlers.clear();
        console.log("Notification WebSocket connection closed by client");
    }
}