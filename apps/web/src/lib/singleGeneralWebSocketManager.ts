import { WebSocketClient } from "@/lib/socket.front";

let socketClient: WebSocketClient | null = null;

export function getWebSocketClient(token: string): WebSocketClient {
    if (!socketClient) {
        socketClient = new WebSocketClient(`ws://localhost:7001?token=${token}`);
    }
    return socketClient;
}

export function closeWebSocketClient() {
    socketClient = null;
}
