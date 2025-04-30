"use client";

import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";


export function NotificationProvider({ children }: { children: React.ReactNode }) {
    useNotificationWebSocket();
    return <>{children}</>;
}