import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import Image from "next/image";
import { EventChannelType } from "types/types";

interface EventNotConnectedToGoogleProps {
    channel: EventChannelType;
}

export default function EventNotConnectedToGoogle({ channel }: EventNotConnectedToGoogleProps) {
    return (
        <div className="overflow-hidden relative h-full">
            <div className="absolute -bottom-[30%] -right-0 rounded-[11px] p-[5px] border-[1px] border-dashed border-neutral-600 bg-neutral-500/30">
                    <Image
                        src={"/images/calendar-page.png"}
                        width={600}
                        height={400}
                        alt="calendar-page"
                        className="rounded-[6px]"
                        unoptimized
                    />
                </div>
            <DashboardComponentHeading
                description="Connecting this channel to Google Calendar allows you to schedule, update, and sync events effortlessly with your Google account."
            >
                {`${channel.title} is not yet connected to Google Calendar.`}
            </DashboardComponentHeading>

            <div className="flex w-full items-center justify-between">
                <div>hey</div>
                
            </div>

        </div>
    )
}