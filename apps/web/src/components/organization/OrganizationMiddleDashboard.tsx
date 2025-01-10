import { selectedChannelSelector } from '@/recoil/atoms/organizationAtoms/organizationDashboardManagement';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { ChannelType, EventChannelType, WelcomeChannel } from 'types';
import DashboardComponentHeading from '../dashboard/DashboardComponentHeading';

export default function ChannelContent() {
    const selectedChannel = useRecoilValue(selectedChannelSelector);
    console.log("selected channel is : ", selectedChannel);

    if (!selectedChannel) {
        return <div className="bg-[#171717] w-full p-4">Select a channel</div>;
    }

    switch (selectedChannel.type) {
        case 'regular':
            return <RegularChannelView channel={selectedChannel.data} />;
        case 'event':
            return <EventChannelView channel={selectedChannel.data} />;
        case 'welcome':
            return <WelcomeChannelView channel={selectedChannel.data} />;
        default:
            return <div className="bg-[#171717] w-full p-4">Unknown channel type</div>;
    }
}

interface RegularChannelViewProps {
    channel: ChannelType;
}

function RegularChannelView({ channel }: RegularChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
        </div>
    );
}

interface EventChannelViewProps {
    channel: EventChannelType;
}

function EventChannelView({ channel }: EventChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <DashboardComponentHeading description={channel.description}>{channel.title}</DashboardComponentHeading>
        </div>
    );
}

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

function WelcomeChannelView({ channel }: WelcomeChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <DashboardComponentHeading description={channel.welcome_message!}>{"Welcome"}</DashboardComponentHeading>
        </div >
    );
}