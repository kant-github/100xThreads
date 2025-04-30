import WebSocketNotificationClient from "@/lib/socket.notification";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";
import { useCallback, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NotificationType } from "types/types";

export const useNotificationWebSocket = () => {
    const webSocketRef = useRef<WebSocketNotificationClient | null>(null);
    const session = useRecoilValue(userSessionAtom);

    const initializeWebSocket = useCallback(() => {

        if (session.user?.id) {
            const wsToken = btoa(JSON.stringify({
                userId: session.user.id,
                userName: session.user.name
            }));

            const ws = new WebSocketNotificationClient(`ws://localhost:7002/socket?token=${wsToken}`);
            webSocketRef.current = ws;
        }
    }, [session.user?.id, session.user?.name]);

    useEffect(() => {
        initializeWebSocket();
        return () => {
            console.log("web socket cleaned");
        };
    }, [initializeWebSocket]);
};