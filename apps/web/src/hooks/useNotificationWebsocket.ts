import WebSocketNotificationClient from "@/lib/socket.notification"
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useCallback, useEffect, useState } from "react"
import { useRecoilValue } from "recoil";

export const useNotificationWebSocket = () => {
    const [socket, setSocket] = useState<WebSocketNotificationClient | null>(null);
    const session = useRecoilValue(userSessionAtom);

    const initializeConnection = useCallback(() => {
        const newSocket = new WebSocketNotificationClient('ws://localhost:7002/socket');
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.close();
            }
        }
    }, [session.user?.id])


    useEffect(() => {
        const cleanup = initializeConnection();
        return cleanup;
    }, [initializeConnection])

    function subscribeToHandler(type: string, handler: (payload: any) => void) {
        if (!socket) return () => { };
        socket.subscribeToHandlers(type, handler);

        return socket.subscribeToHandlers(type, handler);
    }

    return {
        subscribeToHandler,

    };
}