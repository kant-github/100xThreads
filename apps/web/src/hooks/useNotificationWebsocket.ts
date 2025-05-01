import WebSocketNotificationClient from "@/lib/socket.notification";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";
import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export const useNotificationWebSocket = () => {
    const webSocketRef = useRef<WebSocketNotificationClient | null>(null);
    const session = useRecoilValue(userSessionAtom);
    const [notifications, setNotifications] = useRecoilState(NotificationAtom);

    const initializeWebSocket = useCallback(() => {
        if (session.user?.id && !webSocketRef.current) {
            const wsToken = btoa(JSON.stringify({
                userId: session.user.id,
                userName: session.user.name
            }));
            const ws = new WebSocketNotificationClient(`ws://localhost:7002/socket?token=${wsToken}`);
            webSocketRef.current = ws;
            console.log("WebSocket connection initialized");
        }
    }, [session.user?.id, session.user?.name]);

    useEffect(() => {
        initializeWebSocket();

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
                console.log("WebSocket connection closed");
            }
        };
    }, [initializeWebSocket]);

    useEffect(() => {
        const interval = setInterval(() => {
            const wsClient = webSocketRef.current;
            if (wsClient) {

                const notificationHandler = (data: any) => {
                    console.log("final data --------------- >", data);
                    setNotifications(prev => [data, ...prev]);
                };

                const unsubscribe = wsClient.subscribeToHandlers("NOTIFICATION", notificationHandler);
                clearInterval(interval); // Stop checking once subscribed

                return () => {
                    console.log("Cleaning up notification subscription");
                    unsubscribe?.();
                };
            }
        }, 500); // check every 500ms

        return () => clearInterval(interval);
    }, []);
};
