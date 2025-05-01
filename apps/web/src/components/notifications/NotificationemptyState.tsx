import { Bell } from "lucide-react";

interface NotificationemptyStateProps {
    activeFilter: "all" | "unread"
}

export default function ({ activeFilter }: NotificationemptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <Bell className="w-12 h-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-sm text-gray-500 max-w-sm">
                {activeFilter === 'unread'
                    ? "You've read all your notifications. Switch to 'All' to see previous notifications."
                    : "You don't have any notifications yet."}
            </p>
        </div>
    )
}