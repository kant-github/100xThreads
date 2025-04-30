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
        // Only create a new connection if one doesn't already exist
        if (session.user?.id && !webSocketRef.current) {
            const wsToken = btoa(JSON.stringify({
                userId: session.user.id,
                userName: session.user.name
            }));
            
            const ws = new WebSocketNotificationClient(`ws://localhost:7002/socket?token=${wsToken}`);
            webSocketRef.current = ws;
            
            console.log("WebSocket connection established");
        }
    }, [session.user?.id, session.user?.name]);
    
    useEffect(() => {
        initializeWebSocket();
        
        return () => {
            // Clean up the connection when the component unmounts
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
                console.log("WebSocket connection closed");
            }
        };
    }, [initializeWebSocket]);
};