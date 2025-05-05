import { AiOutlineConsoleSql } from "react-icons/ai";
import { NotificationType } from "types/types";

export default class WebSocketNotificationClient {
    private ws: WebSocket | null = null;
    private URL: string;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private messageHandlers: Map<String, ((payload: any) => void)[]> = new Map();
    private subscribedChannels: Set<String> = new Set(); // Track subscribed channels

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
                    this.processMessage(message);
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

    private processMessage(message: any) {
        const type: string = message.type;
        const notification: NotificationType = message.data;
        const handlers = this.messageHandlers.get(type) || [];
        handlers.forEach(handler => {
            try {
                handler(notification);
            } catch (error) {
                console.error("Error in message handler:", error);
            }
        })
    }

    public subscribeToBackendWSS(key: string, type: string) {
        const channelKey = `${key}:${type}`;
        if (!this.subscribedChannels.has(channelKey)) {
            this.sendMessage('subscribe-channel', key, {
                key,
                type
            })
            this.subscribedChannels.add(channelKey);
        }
    }

    public unSubscribeToBackendWSS(key: string, type: string) {
        const channelKey = `${key}:${type}`;
        if (this.subscribedChannels.has(channelKey)) {
            this.sendMessage('unsubscribe-channel', key, {
                key,
                type
            })
            this.subscribedChannels.delete(channelKey);
        }
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

    public sendMessage(type: string, key: string, payload: any) {
        if (this.isConnected === false) return;
        const message = {
            type,
            key,
            payload
        }

        try {
            this.ws?.send(JSON.stringify(message));
        } catch (err) {
            console.error("Error ins sending message to notification server", err)
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