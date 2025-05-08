import { NotificationType } from "types/types"
import NotificationemptyState from "./NotificationemptyState";
import { useMemo } from "react";
import { CalculateDate } from "./CalculateDate";
import NotificationRendererByGroup from "./NotificationRendererByGroup";

interface NotificationsRendererProps {
    filteredNotifications: NotificationType[];
    activeFilter: 'all' | 'unread'
}

export default function NotificationsRenderer({ filteredNotifications, activeFilter }: NotificationsRendererProps) {

    const calculateDate = new CalculateDate();

    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [] as NotificationType[],
            yesterday: [] as NotificationType[],
            thisWeek: [] as NotificationType[],
            thisMonth: [] as NotificationType[],
            older: [] as NotificationType[]
        };

        filteredNotifications?.forEach?.(notification => {
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
        <div className="overflow-y-auto flex-1 bg-[#1f1f1f] my-3 rounded-[8px]">
            {filteredNotifications.length === 0 ? (
                <>
                    <NotificationemptyState activeFilter={activeFilter} />
                </>
            ) : (
                <>
                    {NotificationRendererByGroup("Today", groupedNotifications.today)}
                    {NotificationRendererByGroup("Yesterday", groupedNotifications.yesterday)}
                    {NotificationRendererByGroup("This Week", groupedNotifications.thisWeek)}
                    {NotificationRendererByGroup("This Month", groupedNotifications.thisMonth)}
                    {NotificationRendererByGroup("Older", groupedNotifications.older)}
                </>
            )}
        </div>
    )
}