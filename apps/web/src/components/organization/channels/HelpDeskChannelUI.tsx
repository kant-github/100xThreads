import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType } from "types/types";
import HelpDeskChannelMessages from "../helpdesk-channel/HelpDeskChannelMessages";
import { MdHelpCenter } from "react-icons/md";
import DesignButton from "@/components/buttons/DesignButton";


interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <div className="flex flex-row justify-between w-full">
                <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
                <DesignButton>
                    Raise an Issue
                    <MdHelpCenter className=" text-amber-500" size={18} />
                </DesignButton>
            </div>
            <UtilityCard className="p-8 w-full flex-grow mt-4 dark:bg-neutral-800 flex flex-col shadow-lg shadow-black/20">
                <HelpDeskChannelMessages className="h-[80%]" />
            </UtilityCard>
        </div>
    );
}