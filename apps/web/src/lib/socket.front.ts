export type WebSocketMessage = {
    type: string;
    payload: any;
    timestamp: number
}
export type WebSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 0;
    private reconnectTimeout = 1000;

    private MessageHandlers: Map<string, ((payload: any) => void)[]> = new Map();


    constructor(private URL: string) {
        this.connect();
    }

    private connect() {
        try {
            this.ws = new WebSocket(this.URL);

            this.ws.onopen = () => {
                this.reconnectAttempts = 0;
                this.reconnectTimeout = 1000;
            }

            this.ws.onclose = () => {
                this.handleReconnect();
            }

            this.ws.onerror = () => {
                this.handleReconnect();
            }

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);

                }
            }
        } catch (err) {
            console.error('Error connecting to WebSocket:', err);
            this.handleReconnect();
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnct attempts reached');
            return;
        }
        this.reconnectAttempts++;

        // Calculate new timeout with exponential backoff
        // Each retry waits longer than the previous one
        const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);

        setTimeout(() => {
            this.connect();
        }, timeout);
    }

    public handleMessage(message: WebSocketMessage) {
        const handlers = this.MessageHandlers.get(message.type) || [];

        handlers.forEach(handler => {
            try {
                handler(message.payload);
            } catch (err) {
                console.error(`Error in message handler for type ${message.type}:`, err);
            }
        }
        )

    }

    public subscribe(type: string, handler: (payload: any) => void) {
        const handlers = this.MessageHandlers.get(type) || [];
        this.MessageHandlers.set(type, [...handlers, handler]);

        return () => {
            const handlers = this.MessageHandlers.get(type) || [];
            this.MessageHandlers.set(type,
                handlers.filter(h => h !== handler)
            )
        }
    }

    public send(type: string, payload: any) {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');

        }
        const message: WebSocketMessage = {
            type,
            payload,
            timestamp: Date.now()
        }
        this.ws.send(JSON.stringify(message))
    }
}