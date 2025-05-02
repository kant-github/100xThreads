import WebSocketNotificationClient from "@/lib/socket.notification";

let wsClient: WebSocketNotificationClient | null = null;

export function getWebSocketClient(token: string) {
    if (!wsClient) {
        wsClient = new WebSocketNotificationClient(`ws://localhost:7002/socket?token=${token}`);
        console.log("WebSocket initialized");
    }
    return wsClient;
}

export function closeWebSocketClient() {
    if (wsClient) {
        wsClient.close();
        wsClient = null;
        console.log("WebSocket closed");
    }
}
