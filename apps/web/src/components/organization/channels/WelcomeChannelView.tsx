import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { WelcomeChannel } from "types";

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.welcome_message!}>{"Welcome"}</DashboardComponentHeading>
            <UtilityCard className="p-8 w-full flex-grow mt-4">
                Hi
            </UtilityCard>
        </div >
    );
}