// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { MessageType } from 'types';
import { WebSocketClient } from '@/lib/socket.front';

export const useWebSocket = (
    onMessageReceived: (message: MessageType) => void
) => {
    const session = useRecoilValue(userSessionAtom);
    const wsRef = useRef<WebSocketClient | null>(null);

    useEffect(() => {
        // Create WebSocket connection with auth token
        const ws = new WebSocketClient(
            `ws://localhost:7001?token=${session.user?.token}`
        );
        wsRef.current = ws;

        // Subscribe to message events
        const unsubscribe = ws.subscribe('message', (payload) => {
            onMessageReceived(payload);
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
        };
    }, [session.user?.token]);

    const subscribeToChannel = (channelId: string, organizationId: string) => {
        if (!wsRef.current) return;
        
        wsRef.current.send('subscribe-channel', {
            channelId,
            organizationId,
            type: 'messages'
        });
    };

    const sendMessage = (message: MessageType) => {
        if (!wsRef.current) return;

        wsRef.current.send('message', {
            channelId: message.channel_id,
            type: 'messages',
            ...message
        });
    };

    return {
        subscribeToChannel,
        sendMessage
    };
};