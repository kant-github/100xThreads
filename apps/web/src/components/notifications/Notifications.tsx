import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";
import NotificationFilterButtons from "./NotificationFilterButtons";
import NotificationsRenderer from "./NotificationsRenderer";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";

interface OrganizationNotificationsRendererProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ open, setOpen }: OrganizationNotificationsRendererProps) {
    const [notifications, setNotifications] = useRecoilState(NotificationAtom);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    function friendRequestAcceptHandler(newNotification: any) {
        setNotifications(prev =>
            [
                newNotification,
                ...prev.filter(notification => notification.id !== newNotification.metadata?.oldNotificationId)
            ]
        );
    }

    function newNotificationHandler(newMessage: any) {
        setNotifications(prev => [newMessage, ...prev]);
    }

    const { subscribeToHandler, subscribeToBackend, unsubscribeFromBackend } = useNotificationWebSocket();

    useEffect(() => {
        if (open) {
            subscribeToBackend('global', 'accept-friend-request');
            const unsubscribeFriendRequestAcceptHandler = subscribeToHandler('accept-friend-request', friendRequestAcceptHandler);
            const unsubscribeSendFriendRequestHandler = subscribeToHandler('send-friend-request', friendRequestAcceptHandler);
            const unsubscribeNotificationHandler = subscribeToHandler('notifications', newNotificationHandler);

            return () => {
                unsubscribeFromBackend('global', 'accept-friend-request');
                unsubscribeFriendRequestAcceptHandler();
                unsubscribeSendFriendRequestHandler();
                unsubscribeNotificationHandler();
            };
        }
    }, [session.user?.id, organizationId, open]);



    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter(notification => !notification.is_read);
        }
        return notifications;
    }, [notifications, activeFilter]);


    async function fetchNotifications() {
        if (!session.user?.token) return;
        const data = await axios.get(`${API_URL}/notifications`, {
            headers: {
                authorization: `Bearer ${session.user.token}`,
            }
        })
        setNotifications(data.data.data);
    }

    useEffect(() => {
        fetchNotifications();
    }, [open])


    return (

        <UtilitySideBar
            width="4/12"
            blob={true}
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col px-5 py-3 min-w-[300px]">
                    <NotificationFilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    <NotificationsRenderer activeFilter={activeFilter} filteredNotifications={filteredNotifications} />
                </div>
            }
        />
    )
}