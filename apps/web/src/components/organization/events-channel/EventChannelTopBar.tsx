import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import { eventssideBarAtom } from "@/recoil/atoms/events/eventssideBarAtom";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { EventChannelType } from "types/types";
import EventSideBar from "./EventSideBar";

interface EventChannelTopBarProps {
    channel: EventChannelType;
    setShowGoogleCalendarPage: Dispatch<SetStateAction<boolean>>;
}

export default function ({ channel, setShowGoogleCalendarPage }: EventChannelTopBarProps) {
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [eventSideBar, setEventSideBar] = useRecoilState(eventssideBarAtom)
    const isConnected = Boolean(
        organizationUser?.user?.access_token &&
        organizationUser?.user?.refresh_token
    );

    const isTokenValid = organizationUser?.user?.token_expires_at
        ? new Date(organizationUser.user.token_expires_at) > new Date()
        : false;

    const isFullyConnected = isConnected && isTokenValid;



    return (
        <div className="flex items-center justify-between">
            <DashboardComponentHeading description={channel.description}>
                {channel.title}
            </DashboardComponentHeading>
            <div className="flex flex-row items-center gap-x-3">
                <Button
                    onClick={() => setEventSideBar(true)}
                    className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                    variant={"outline"}
                >
                    <Calendar className="h-4 w-4 mr-1" />
                    Events
                </Button>
                <Button
                    onClick={() => {
                        setShowGoogleCalendarPage(true);

                    }}
                    className="bg-neutral-700/70 rounded-[6px] px-4 w-fit flex items-center gap-x-3"
                    variant={"ghost"}
                >
                    <Image
                        src={"/images/google-calendar.png"}
                        height={18}
                        width={18}
                        unoptimized
                        alt="google calendar"
                    />
                    <span className="text-neutral-100 text-[12px] tracking-wide font-normal">
                        {isFullyConnected ? "Connected" : "Connect Google calendar"}
                    </span>
                </Button>
            </div>
            <EventSideBar channel={channel} open={eventSideBar} setOpen={setEventSideBar} />
        </div>
    )
}