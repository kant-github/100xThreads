import { WebSocketClient } from "@/lib/socket.front";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useEffect, useRef } from "react"
import { useRecoilValue } from "recoil";
import { MessageType } from "types"

export const useWebSocket = () => {
    const webSocketRef = useRef<WebSocketClient | null>(null);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);
  
    useEffect(() => {
      const wsToken = btoa(JSON.stringify({
        userId: session.user?.id,
        organizationId: organization?.id,
        userName: session.user?.name
      }));
  
      const ws = new WebSocketClient(`ws://localhost:7001?token=${wsToken}`);
      webSocketRef.current = ws;
  
      return () => {
        // Cleanup if needed
      };
    }, [session.user?.token]);
  
    function subscribeToChannel(
      channelId: string, 
      organizationId: string, 
      type: string, 
      handler: (payload: any) => void
    ) {
      if (!webSocketRef.current) return () => {};
  
      // Send subscribe event to backend
      webSocketRef.current.send('subscribe-channel', {
        channelId,
        organizationId,
        type
      });
  
      // Subscribe handler for the specific message type
      return webSocketRef.current.subscribe(type, handler);
    }
  
    function unsubscribeChannel(
      channelId: string, 
      organizationId: string, 
      type: string
    ) {
      if (!webSocketRef.current) return;
  
      webSocketRef.current.send('unsubscribe-channel', {
        channelId,
        organizationId,
        type
      });
    }
  
    function sendMessage(payload: any, channelId: string, type: string) {
      if (!webSocketRef.current) return;
      webSocketRef.current.send(type, {
        channelId,
        type,
        ...payload
      });
    }
  
    return {
      subscribeToChannel, 
      unsubscribeChannel, 
      sendMessage
    };
  };