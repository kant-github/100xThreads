export class WebSocketClient {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 1000;
    private messageQueue: { type: string; payload: any }[] = []; // Queue for messages
    private isConnected = false;
    private MessageHandlers: Map<string, ((payload: any) => void)[]> = new Map();

    constructor(private URL: string) {
        this.connect();
    }

    private connect() {
        try {
            this.ws = new WebSocket(this.URL);

            this.ws.onopen = () => {
                console.log("connection onopen");
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.reconnectTimeout = 1000;

                while (this.messageQueue.length > 0) {
                    const { type, payload } = this.messageQueue.shift()!;
                    this.send(type, payload);
                }
            }

            this.ws.onclose = () => {
                this.isConnected = false;
                this.handleReconnect();
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
                this.handleReconnect();
            }

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log("message recieved in frontend from backend : ", message);
                    this.handleMessage(message);
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            }
        } catch (err) {
            console.error('Error connecting to WebSocket:', err);
            this.isConnected = false;
            this.handleReconnect();
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnect attempts reached');
            return;
        }
        this.reconnectAttempts++;
        const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
        setTimeout(() => {
            this.connect();
        }, timeout);
    }

    public handleMessage(message: any) {
        const handlers = this.MessageHandlers.get(message.type) || [];
        handlers.forEach(handler => {
            try {
                handler(message.payload);
            } catch (err) {
                console.error(`Error in message handler for type ${message.type}:`, err);
            }
        });
    }

    public subscribe(type: string, handler: (payload: any) => void) {
        const handlers = this.MessageHandlers.get(type) || [];
        this.MessageHandlers.set(type, [...handlers, handler]);
        return () => {
            const handlers = this.MessageHandlers.get(type) || [];
            this.MessageHandlers.set(type,
                handlers.filter(h => h !== handler)
            );
        };
    }

    public send(type: string, payload: any) {
        if (!this.isConnected || this.ws?.readyState !== WebSocket.OPEN) {
            console.log("Queuing message - WebSocket not ready");
            this.messageQueue.push({ type, payload });
            return;
        }

        const message = {
            type,
            payload,
            timestamp: Date.now()
        };
        console.log("sending message", message);

        try {
            this.ws!.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error sending message:', error);
            this.messageQueue.push({ type, payload });
        }
    }

    // Add method to check connection status
    public isReady(): boolean {
        return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
    }

    // Add method to get current connection state
    public getState() {
        if (this.isConnected) return 'connected';
        if (this.reconnectAttempts > 0) return 'reconnecting';
        if (this.ws?.readyState === WebSocket.CONNECTING) return 'connecting';
        return 'disconnected';
    }
}