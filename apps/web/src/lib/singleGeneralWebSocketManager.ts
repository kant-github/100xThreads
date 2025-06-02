import { WebSocketClient } from "@/lib/socket.front";

let socketClient: WebSocketClient | null = null;

export function getWebSocketClient(token: string): WebSocketClient {
    if (!socketClient) {
        socketClient = new WebSocketClient(`wss://shelvr.kantbuilds.com/ws-server?token=${token}`);
    }
    return socketClient;
}

export function closeWebSocketClient() {
    socketClient = null;
}
