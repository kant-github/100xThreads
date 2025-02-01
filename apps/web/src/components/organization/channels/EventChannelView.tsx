import Calendar from "@/components/calendar/Calendar";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { EventChannelType } from "types";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-neutral-900 w-full p-4">
            <DashboardComponentHeading description={channel.description}>{channel.title}</DashboardComponentHeading>
            <Calendar />
        </div>
    );
}
