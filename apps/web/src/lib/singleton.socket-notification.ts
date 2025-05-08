import WebSocketNotificationClient from "@/lib/socket.notification";

let wsClient: WebSocketNotificationClient | null = null;

export function getWebSocketClient(token: string) {
    if (!wsClient) {
        wsClient = new WebSocketNotificationClient(`wss://shelvr.kantbuilds.com/ws-events?token=${token}`);
    }
    return wsClient;
}

export function closeWebSocketClient() {
    if (wsClient) {
        wsClient.close();
        wsClient = null;
    }
}
