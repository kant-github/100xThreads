import { WebSocketClient } from "@/lib/socket.front";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import jwt from 'jsonwebtoken'
import { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil";
import { MessageType } from "types"

export const useWebSocket = (
    onMessageReceived: (message: MessageType) => void
) => {
    const webSocketRef = useRef<WebSocketClient | null>(null);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);

    useEffect(() => {

        const wsToken = btoa(JSON.stringify({
            userId: session.user?.id,
            organizationId: organization?.id,
            userName: session.user?.name
        }));

        const ws = new WebSocketClient(
            `ws://localhost:7001?token=${wsToken}`
        )
        webSocketRef.current = ws

    }, [session.user?.token])

    function subscribeToChannel(channelId: string, organizationId: string) {
        if (!webSocketRef.current) return;
        webSocketRef.current.send('subscribe-channel', {
            channelId,
            organizationId,
            type: 'message'
        })
    }

    function unsubscribeChannel(channelId: string, organizationId: string) {
        if (!webSocketRef.current) return;
        webSocketRef.current.send('unsubscribe-channel', {
            channelId,
            organizationId,
            type: 'message'
        })
    }

    function sendMessage(payload: any, channelId: string) {
        if (!webSocketRef.current) return;
        webSocketRef.current.send('message', {
            channelId,
            type: 'message',
            ...payload
        })
    }
    return {
        subscribeToChannel, unsubscribeChannel, sendMessage
    }
}