import { NotificationType } from "types/types";
import EachNotification from "./EachNotification";

export default function (title: string, notifications: NotificationType[]) {
    if (notifications.length === 0) return null;

    return (
        <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">{title}</h3>
            <div className="space-y-1">
                {notifications.map(EachNotification)}
            </div>
        </div>
    );
};