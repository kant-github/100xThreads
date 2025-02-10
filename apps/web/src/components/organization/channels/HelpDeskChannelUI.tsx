import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType } from "types";
import HelpDeskChannelMessages from "../helpdesk-channel/HelpDeskChannelMessages";
import Image from "next/image";
import HelpDeskChannelTopUI from "../helpdesk-channel/HelpDeskChannelTopUI";
import { useState } from "react";


interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            <UtilityCard className="p-8 w-full flex-grow mt-4 dark:bg-neutral-800 flex flex-col">
                <HelpDeskChannelTopUI />
                <HelpDeskChannelMessages className="h-[80%]" />
            </UtilityCard>
        </div>
    );
}