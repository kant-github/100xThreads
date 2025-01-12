import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { WelcomeChannel } from "types";

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <DashboardComponentHeading description={channel.welcome_message!}>{"Welcome"}</DashboardComponentHeading>
        </div >
    );
}