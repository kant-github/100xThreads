import { Dispatch, SetStateAction, useMemo, useState } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import { useRecoilValue } from "recoil";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";
import NotificationFilterButtons from "./NotificationFilterButtons";
import NotificationsRenderer from "./NotificationsRenderer";
import { CalculateDate } from "./CalculateDate";

interface OrganizationNotificationsRendererProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ open, setOpen }: OrganizationNotificationsRendererProps) {
    const notifications = useRecoilValue(NotificationAtom);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    const dateCalculator = new CalculateDate();

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter(notification => !notification.is_read);
        }
        return notifications;
    }, [notifications, activeFilter]);


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