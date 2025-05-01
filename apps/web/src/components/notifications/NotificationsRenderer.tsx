import { NotificationType } from "types/types"
import NotificationemptyState from "./NotificationemptyState";
import { useMemo } from "react";
import { CalculateDate } from "./CalculateDate";

interface NotificationsRendererProps {
    filteredNotifications: NotificationType[];
    activeFilter: 'all' | 'unread'
}

export default function ({ filteredNotifications, activeFilter }: NotificationsRendererProps) {

    const calculateDate = new CalculateDate();
    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [] as NotificationType[],
            yesterday: [] as NotificationType[],
            thisWeek: [] as NotificationType[],
            thisMonth: [] as NotificationType[],
            older: [] as NotificationType[]
        };

        filteredNotifications.forEach(notification => {
            if (calculateDate.isToday(notification.created_at)) {
                groups.today.push(notification);
            } else if (calculateDate.isYesterday(notification.created_at)) {
                groups.yesterday.push(notification);
            } else if (calculateDate.isThisWeek(notification.created_at)) {
                groups.thisWeek.push(notification);
            } else if (calculateDate.isThisMonth(notification.created_at)) {
                groups.thisMonth.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    }, [filteredNotifications]);

    return (
        <div className="overflow-y-auto flex-1">
            {filteredNotifications.length === 0 ? (
                <>
                    <NotificationemptyState activeFilter={activeFilter} />
                </>
            ) : (
                <>
                    
                </>
            )}
        </div>
    )
}