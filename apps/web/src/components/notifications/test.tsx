import { Dispatch, SetStateAction, useState, useMemo } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";
import { Bell, Calendar, CheckCircle, Clock, MessageCircle, Users, UserPlus, Briefcase, Hash, BellRing, PenTool, List, AlertCircle, Heart } from "lucide-react";

// Types imported from your code
import type { NotificationType, NotificationTypeEnum } from "@/types/notifications";

interface OrganizationNotificationsRendererProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationsRenderer({
    open,
    setOpen
}: OrganizationNotificationsRendererProps) {
    const notifications = useRecoilValue(NotificationAtom);
    const setNotifications = useSetRecoilState(NotificationAtom);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    // Filter notifications based on the active filter
    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter(notification => !notification.is_read);
        }
        return notifications;
    }, [notifications, activeFilter]);

    // Helper functions for date checks
    const isToday = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isYesterday = (dateStr: string) => {
        const date = new Date(dateStr);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    };

    const isThisWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        return date >= startOfWeek && !isToday(dateStr) && !isYesterday(dateStr);
    };

    const isThisMonth = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear() &&
            !isToday(dateStr) && !isYesterday(dateStr) && !isThisWeek(dateStr);
    };

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [] as NotificationType[],
            yesterday: [] as NotificationType[],
            thisWeek: [] as NotificationType[],
            thisMonth: [] as NotificationType[],
            older: [] as NotificationType[]
        };

        filteredNotifications.forEach(notification => {
            if (isToday(notification.created_at)) {
                groups.today.push(notification);
            } else if (isYesterday(notification.created_at)) {
                groups.yesterday.push(notification);
            } else if (isThisWeek(notification.created_at)) {
                groups.thisWeek.push(notification);
            } else if (isThisMonth(notification.created_at)) {
                groups.thisMonth.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    }, [filteredNotifications]);

    // Mark notification as read
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, is_read: true }
                    : notification
            )
        );

        // Here you would also send an API request to update on the server
        // e.g. fetch('/api/notifications/mark-read', { method: 'POST', body: JSON.stringify({ id }) })
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, is_read: true }))
        );

        // Here you would also send an API request to update on the server
        // e.g. fetch('/api/notifications/mark-all-read', { method: 'POST' })
    };

    // Get icon for notification type
    const getNotificationIcon = (type: NotificationTypeEnum) => {
        switch (type) {
            case 'FRIEND_REQUEST_RECEIVED':
            case 'FRIEND_REQUEST_ACCEPTED':
            case 'FRIEND_REQUEST_REJECTED':
            case 'FRIEND_ONLINE':
                return <UserPlus className="w-5 h-5 text-blue-500" />;

            case 'FRIEND_MESSAGE_RECEIVED':
            case 'NEW_CHANNEL_MESSAGE':
            case 'CHANNEL_MENTION':
                return <MessageCircle className="w-5 h-5 text-green-500" />;

            case 'ORG_INVITE_RECEIVED':
            case 'ORG_JOIN_REQUEST_RESPONSE':
            case 'ORG_ROLE_CHANGED':
            case 'ORG_JOIN_REQUEST_RECEIVED':
                return <Briefcase className="w-5 h-5 text-purple-500" />;

            case 'NEW_ANNOUNCEMENT':
            case 'ANNOUNCEMENT_REQUIRING_ACK':
                return <BellRing className="w-5 h-5 text-yellow-500" />;

            case 'EVENT_CREATED':
            case 'EVENT_REMINDER':
            case 'EVENT_UPDATED':
            case 'EVENT_CANCELLED':
                return <Calendar className="w-5 h-5 text-indigo-500" />;

            case 'PROJECT_ADDED':
                return <PenTool className="w-5 h-5 text-teal-500" />;

            case 'TASK_ASSIGNED':
            case 'TASK_DUE_SOON':
            case 'TASK_STATUS_CHANGED':
                return <List className="w-5 h-5 text-orange-500" />;

            case 'NEW_POLL':
            case 'POLL_ENDING_SOON':
            case 'POLL_RESULTS':
                return <Users className="w-5 h-5 text-violet-500" />;

            case 'ISSUE_ASSIGNED':
            case 'ISSUE_STATUS_CHANGED':
                return <AlertCircle className="w-5 h-5 text-red-500" />;

            case 'CHAT_REACTION':
            case 'LIKED_MESSAGE':
                return <Heart className="w-5 h-5 text-pink-500" />;

            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    // Format date for display
    const formatNotificationTime = (dateString: string) => {
        const date = new Date(dateString);

        if (isToday(dateString)) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } else if (isYesterday(dateString)) {
            return "Yesterday";
        } else if (isThisWeek(dateString)) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        } else {
            const month = date.toLocaleString('default', { month: 'short' });
            return `${month} ${date.getDate()}, ${date.getFullYear()}`;
        }
    };

    // Helper to render a single notification
    const renderNotification = (notification: NotificationType) => {
        return (
            <div
                key={notification.id}
                className={`flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                onClick={() => {
                    markAsRead(notification.id);
                    if (notification.action_url) {
                        // Here you would navigate to the action URL
                        // e.g. router.push(notification.action_url)
                        console.log(`Navigate to: ${notification.action_url}`);
                    }
                }}
            >
                <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-blue-900' : 'text-gray-900'}`}>{notification.title}</p>
                        <span className="text-xs text-gray-500">{formatNotificationTime(notification.created_at)}</span>
                    </div>
                    <p className={`text-sm ${!notification.is_read ? 'text-blue-800' : 'text-gray-600'}`}>{notification.message}</p>

                    {/* Conditionally show action button based on notification type */}
                    {notification.type.includes('REQUEST') && !notification.is_read && (
                        <div className="mt-2 flex space-x-2">
                            <button
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Accept action for ${notification.id}`);
                                    markAsRead(notification.id);
                                }}
                            >
                                Accept
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Decline action for ${notification.id}`);
                                    markAsRead(notification.id);
                                }}
                            >
                                Decline
                            </button>
                        </div>
                    )}
                </div>
                {!notification.is_read && (
                    <div className="flex-shrink-0 ml-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                )}
            </div>
        );
    };

    // Render notification group
    const renderNotificationGroup = (title: string, notifications: NotificationType[]) => {
        if (notifications.length === 0) return null;

        return (
            <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">{title}</h3>
                <div className="space-y-1">
                    {notifications.map(renderNotification)}
                </div>
            </div>
        );
    };

    // Empty state when no notifications
    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <Bell className="w-12 h-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-sm text-gray-500 max-w-sm">
                {activeFilter === 'unread'
                    ? "You've read all your notifications. Switch to 'All' to see previous notifications."
                    : "You don't have any notifications yet."}
            </p>
        </div>
    );

    return (
        <UtilitySideBar
            width="4/12"
            blob={true}
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col px-5 py-3 min-w-[300px]">
                    <div className="flex justify-between items-center">
                        <DashboardComponentHeading description="See all your notifications">
                            Notifications
                        </DashboardComponentHeading>

                        {filteredNotifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'unread'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveFilter('unread')}
                        >
                            Unread
                            {notifications.filter(n => !n.is_read).length > 0 && (
                                <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {notifications.filter(n => !n.is_read).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Notifications list */}
                    <div className="overflow-y-auto flex-1">
                        {filteredNotifications.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            <>
                                {renderNotificationGroup("Today", groupedNotifications.today)}
                                {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
                                {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
                                {renderNotificationGroup("This Month", groupedNotifications.thisMonth)}
                                {renderNotificationGroup("Older", groupedNotifications.older)}
                            </>
                        )}
                    </div>
                </div>
            }
        />
    );
}