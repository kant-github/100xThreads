import { selectedChannelSelector } from '@/recoil/atoms/organizationAtoms/organizationDashboardManagement';
import React from 'react';
import { useRecoilValue } from 'recoil';
import WelcomeChannelView from './channels/WelcomeChannelView';
import EventChannelView from './channels/EventChannelView';
import RegularChannelView from './channels/RegularChannelView';
import { ChannelType, EventChannelType, WelcomeChannel } from 'types/types';
import DefaultOrganizationDashboardUI from './channels/DefaultOrganizationDashboardUI';
import OrganizationSettingsChannelUI from './channels/OrganizationSettingsChannelUI';




export default function ChannelContent() {
    const selectedChannel = useRecoilValue(selectedChannelSelector);
    
    if (!selectedChannel) {
        return <div className="bg-[#171717] w-full p-4">Select a channel</div>;
    }

    switch (selectedChannel.type) {
        case 'org_settings':
            return <OrganizationSettingsChannelUI />
        case 'default':
            return <DefaultOrganizationDashboardUI />
        case 'regular':
            return <RegularChannelView channel={selectedChannel.data as ChannelType} />;
        case 'event':
            return <EventChannelView channel={selectedChannel.data as EventChannelType} />;
        case 'welcome':
            return <WelcomeChannelView channel={selectedChannel.data as WelcomeChannel} />;
        default:
            return <div className="bg-[#0f0f0f] w-full p-4">Unknown channel type</div>;
    }
}

