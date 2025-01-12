import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { EventChannelType } from "types";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <DashboardComponentHeading description={channel.description}>{channel.title}</DashboardComponentHeading>
        </div>
    );
}
