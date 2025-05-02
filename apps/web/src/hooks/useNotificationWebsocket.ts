"use client";
import { useCallback, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { getWebSocketClient } from "@/lib/singleton.socket-notification";
import WebSocketNotificationClient from "@/lib/socket.notification";

export const useNotificationWebSocket = () => {
    const session = useRecoilValue(userSessionAtom);
    const wsClientRef = useRef<WebSocketNotificationClient | null>(null);

    useEffect(() => {

        if (!session.user?.id) return;

        const token = btoa(JSON.stringify({
            userId: session.user.id,
            userName: session.user.name
        }));

        const wsClient = getWebSocketClient(token);
        wsClientRef.current = wsClient;

    }, [session.user?.id, session.user?.name]);

    const sendMessage = useCallback((type: string, key: string, payload: any) => {
        wsClientRef.current?.sendMessage(type, key, {
            type,
            ...payload
        });
    }, [session.user?.id, session.user?.name]);

    const subscribeToHandler = useCallback((type: string, handler: (data: any) => void) => {
        if (!wsClientRef.current) return () => { }
        return wsClientRef.current?.subscribeToHandlers(type, handler);
    }, []);

    const subscribeToBackend = useCallback((key: string, type: string) => {
        if (!wsClientRef.current) return;
        wsClientRef.current.subscribeToBackendWSS(key, type);
    }, [])

    const unsubscribeFromBackend = useCallback((key: string, type: string) => {
        if (!wsClientRef.current) return;
        console.log("sending unsubscribe evnt");
        wsClientRef.current.unSubscribeToBackendWSS(key, type);
    }, [])


    return {
        sendMessage,
        subscribeToHandler,
        subscribeToBackend,
        unsubscribeFromBackend
    };
};
