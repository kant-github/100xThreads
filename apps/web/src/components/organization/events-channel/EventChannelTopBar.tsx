import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { EventChannelType } from "types/types";

interface EventChannelTopBarProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelTopBarProps) {
    return (
        <div className="flex items-center justify-between">
            <DashboardComponentHeading description={channel.description}>{channel.title}</DashboardComponentHeading>
            <Button className="bg-neutral-700/70 rounded-[6px] px-4" variant={"ghost"}>
                <Image
                    src={"/images/google-calendar.png"}
                    height={18}
                    width={18}
                    alt="google calendar"
                />
                <span className="text-neutral-100 text-[12px] tracking-wide font-normal">Connect Google calendar</span>
            </Button>
        </div>
    )
}