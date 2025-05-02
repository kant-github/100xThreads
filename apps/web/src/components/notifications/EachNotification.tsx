import { NotificationType } from "types/types";
import { CalculateDate } from "./CalculateDate";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useRecoilValue } from "recoil";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";

interface EachNotificationProps {
    notification: NotificationType;
}

export default function ({ notification }: EachNotificationProps) {
    const { sendMessage } = useWebSocket();
    const session = useRecoilValue(userSessionAtom);
    const organizationIdKey = `${session.user?.id}`;
    console.log("notification is : ", notification);


    function friendRequestAcceptHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        const newMessage = {
            notificationId: notification.id,
            senderId: notification.sender_id,
            reference_id: notification.reference_id,
            organization_id: organizationIdKey,
            channel_id: 'friends-channel',
            type: 'friend-request-accept'
        };

        sendMessage(newMessage, 'friends-channel', 'friend-request-accept');

    }

    const calculateDate = new CalculateDate();
    return (
        <div
            key={notification.id}
            className={`flex items-start p-3 hover:bg-[#1f1f1f] rounded-lg transition-colors cursor-pointer ${!notification.is_read ? 'bg-neutral-800' : ''}`}
            onClick={() => {
                // markAsRead(notification.id);
                if (notification.action_url) {
                    // Here you would navigate to the action URL
                    // e.g. router.push(notification.action_url)
                    console.log(`Navigate to: ${notification.action_url}`);
                }
            }}
        >
            <div className="ml-3 flex-1">
                <div className="flex justify-between">
                    <p className={`text-xs font-medium ${!notification.is_read ? 'text-neutral-500' : 'text-gray-900'}`}>{notification.title}</p>
                    <span className="text-xs text-gray-500">{calculateDate.formatNotificationTime(notification.created_at)}</span>
                </div>
                <p className={`text-[13px] ${!notification.is_read ? 'text-neutral-300' : 'text-gray-600'}`}>{notification.message}</p>


                {notification.type === 'FRIEND_REQUEST_RECEIVED' && !notification.is_read && (
                    <div className="mt-2 flex space-x-2">
                        <button
                            type="button"
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-[4px] hover:bg-yellow-600/80 transition-colors"
                            onClick={friendRequestAcceptHandler}
                        >
                            Accept
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-[4px] hover:bg-gray-300 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Decline action for ${notification.id}`);
                                // markAsRead(notification.id);
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