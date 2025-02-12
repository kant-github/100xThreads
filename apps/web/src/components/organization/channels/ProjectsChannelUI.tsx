import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType } from "types";
import Projects from "../projects-channel/Projects";

interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            <UtilityCard className="p-8 w-full flex-1 mt-4 dark:bg-neutral-800 flex flex-col min-h-0">
                <Projects />
            </UtilityCard>
        </div>
    );
}