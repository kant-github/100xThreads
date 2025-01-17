import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType } from "types";
import OrganizationMessageComponent from "../OrganizationMessageComponent";

interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.description!}>{channel.title} / Water cooler</DashboardComponentHeading>
            <UtilityCard className="w-full flex-grow mt-4 overflow-hidden">
                <OrganizationMessageComponent channel={channel} />
            </UtilityCard>
        </div>
    );
}