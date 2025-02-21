import { WebSocketClient } from "@/lib/socket.front";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useCallback, useEffect, useRef } from "react"
import { useRecoilValue } from "recoil";

export const useWebSocket = () => {
  
  const webSocketRef = useRef<WebSocketClient | null>(null);
  const session = useRecoilValue(userSessionAtom);
  const organizationIdd = useRecoilValue(organizationIdAtom);

  const initializeWebSocket = useCallback((orgId?: string) => {
    const organizationId = orgId || organizationIdd;

    if (session.user?.id && (organizationId || orgId)) {
      const wsToken = btoa(JSON.stringify({
        userId: session.user.id,
        organizationId: organizationId,
        userName: session.user.name
      }));

      const ws = new WebSocketClient(`ws://localhost:7001?token=${wsToken}`);
      webSocketRef.current = ws;
    }
  }, [session.user?.id, session.user?.name, organizationIdd]);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      console.log("web socket cleaned");
    };
  }, [initializeWebSocket]);

  function subscribeToBackend(channelId: string, organizationId: string, type: string) {
    if (!webSocketRef.current) return;
    webSocketRef.current.subscribeToBackendWSS(channelId, organizationId, type);
  }

  function unsubscribeFromBackend(channelId: string, organizationId: string, type: string) {
    if (!webSocketRef.current) return;
    webSocketRef.current.unSubscribeToBackendWSS(channelId, organizationId, type);
  }

  function subscribeToHandler(type: string, handler: (payload: any) => void) {
    if (!webSocketRef.current) return () => { };
    return webSocketRef.current.subscribe(type, handler);
  }

  function sendMessage(payload: any, channelId: string, type: string) {
    if (!webSocketRef.current) return;
    console.log("sending message", payload);
    console.log("type is : ", type);
    webSocketRef.current.send(type, {
      channelId,
      type,
      ...payload
    });
  }

  return {
    subscribeToBackend,
    unsubscribeFromBackend,
    subscribeToHandler,
    sendMessage
  };
};