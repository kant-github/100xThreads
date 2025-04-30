import { WebSocketClient } from "@/lib/socket.front";

let socketClient: WebSocketClient | null = null;

export function getWebSocketClient(token: string): WebSocketClient {
    if (!socketClient) {
        console.log("new web socket connection ---------------- >");
        socketClient = new WebSocketClient(`ws://localhost:7001?token=${token}`);
    }
    return socketClient;
}

export function closeWebSocketClient() {
    //   socketClient?.close();
    socketClient = null;
}
