import { Dispatch, SetStateAction, useEffect } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";
import { useRecoilValue } from "recoil";
import { NotificationAtom } from "@/recoil/atoms/notifications/NotificationsAtom";

interface OrganizationNotificationsRendererProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ open, setOpen }: OrganizationNotificationsRendererProps) {
    const notifications = useRecoilValue(NotificationAtom);
    console.log("notifications are : ", notifications);
    return (

        <UtilitySideBar
            width="4/12"
            blob={true}
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col px-5 py-3 min-w-[300px]">
                    <DashboardComponentHeading description="see all your notifications">Notifications</DashboardComponentHeading>
                </div>
            }
        />
    )
}