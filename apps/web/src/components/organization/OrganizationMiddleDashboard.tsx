import { selectedChannelSelector } from '@/recoil/atoms/organizationAtoms/organizationDashboardManagement';
import React from 'react';
import { useRecoilValue } from 'recoil';
import WelcomeChannelView from './channels/WelcomeChannelView';
import EventChannelView from './channels/EventChannelView';
import RegularChannelView from './channels/RegularChannelView';




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

