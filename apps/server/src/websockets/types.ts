
export interface WebSocketClient {
    id: string;
    userId?: string;
    channels: Set<string>;
}

