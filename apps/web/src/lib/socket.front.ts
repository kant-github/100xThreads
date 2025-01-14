export type WebSocketMessage = {
    type: string;
    payload: any;
    timestamp: any
}
export type WebSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 0;
    private reconnectTimeout = 1000;

    private MessageHandlers: Map<string, ((payload: any) => void)[]> = new Map();
    private statusHandlers: ((status: WebSocketStatus) => void)[] = [];


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
        } catch (err) {
            console.error('Error connecting to WebSocket:', err);
            this.handleReconnect()
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnct attempts reached');
            return;
        }
        this.reconnectAttempts++;

        const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);

        setTimeout(() => {
            this.connect();
        }, timeout)

    }
}