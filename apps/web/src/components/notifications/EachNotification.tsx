import { NotificationType } from "types/types";
import { CalculateDate } from "./CalculateDate";
import { useRecoilValue } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";
import Image from "next/image";
import NotificationTitle from "./NotificationTitle";

interface EachNotificationProps {
    notification: NotificationType;
}

export default function ({ notification }: EachNotificationProps) {
    const { sendMessage } = useNotificationWebSocket();
    const session = useRecoilValue(userSessionAtom);
    const organizationIdKey = `${session.user?.id}`;

    function friendRequestAcceptHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        const newMessage = {
            friendRequestId: notification.reference_id,
            type: 'accept-friend-request'
        };
        sendMessage('accept-friend-request', 'global', newMessage);
    }

    const calculateDate = new CalculateDate();

    return (
        <div
            key={notification.id}
            className="flex flex-col items-start p-4 hover:bg-[#1f1f1f] rounded-[6px] transition-colors cursor-pointer"
            onClick={() => {
                
            }}
        >
            <div className=" flex items-center w-full">
                {notification.metadata?.image && (
                    <div className="w-[36px] h-[36px]">
                        <Image
                            src={notification.metadata.image}
                            width={36}
                            height={36}
                            alt="user"
                            className="rounded-full object-cover"
                        />
                    </div>
                )}
                <div className="ml-3 w-full">
                    <div className="flex w-full justify-between items-center">
                    <NotificationTitle type={notification.type} title={notification.title} />

                        <span className="text-xs text-gray-500">
                            {calculateDate.formatNotificationTime(notification.created_at)}
                        </span>
                    </div>
                    <p className={`text-[13px] tracking-wide ${!notification.is_read ? 'text-neutral-300' : 'text-gray-600'}`}>
                        {notification.message}
                    </p>
                </div>
            </div>

            {notification.type === 'FRIEND_REQUEST_RECEIVED' && !notification.is_read && (
                <div className="mt-2 flex w-full space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-yellow-600 text-white text-xs font-medium rounded-[4px] hover:bg-yellow-600/80 transition-colors"
                        onClick={friendRequestAcceptHandler}
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 text-xs font-medium rounded-[4px] hover:bg-gray-300 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Decline
                    </button>
                </div>
            )}
        </div>
    );
};
