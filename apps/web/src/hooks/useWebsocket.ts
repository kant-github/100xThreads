import { getWebSocketClient } from "@/lib/singleGeneralWebSocketManager";
import { WebSocketClient } from "@/lib/socket.front";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useRecoilValue } from "recoil";

export const useWebSocket = () => {

  const webSocketRef = useRef<WebSocketClient | null>(null);
  const session = useRecoilValue(userSessionAtom);
  const organizationId = useRecoilValue(organizationIdAtom);

  useMemo(() => {
    if (session.user?.id && organizationId) {
      const wsToken = btoa(
        JSON.stringify({
          userId: session.user.id,
          organizationId: organizationId,
          userName: session.user.name,
        })
      );
      webSocketRef.current = getWebSocketClient(wsToken);
    }
  }, [session.user?.id, session.user?.name, organizationId]);

  function subscribeToBackend(channelId: string, organizationId: string, type: string) {
    if (!webSocketRef.current) return;
    webSocketRef.current.subscribeToBackendWSS(channelId, organizationId, type);
  }

  function unsubscribeFromBackend(channelId: string, organizationId: string, type: string) {
    if (!webSocketRef.current) return;
    console.log("sending unsubscribe evnt");
    webSocketRef.current.unSubscribeToBackendWSS(channelId, organizationId, type);
  }

  function subscribeToHandler(type: string, handler: (payload: any) => void) {
    if (!webSocketRef.current) return () => { };
    return webSocketRef.current.subscribe(type, handler);
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
    subscribeToBackend,
    unsubscribeFromBackend,
    subscribeToHandler,
    sendMessage
  };
};

//       


// <OrganizationId , set <WS connections> >

// <Websocket, set <organzationId:channelId:event_type>>

// <Websocket, set <organzationId:channelId:edit-messages>
// <Websocket, set <organzationId:channelId:delete-messages>