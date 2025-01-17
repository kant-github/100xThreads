export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: number;
}

export interface WebSocketClient {
    id: string;
    userId?: string;
    channels: Set<string>;
}

