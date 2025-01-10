// components/ChannelContent.tsx
import { selectedChannelSelector } from '@/recoil/atoms/organizationAtoms/organizationDashboardManagement';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { ChannelType, EventChannelType, WelcomeChannel } from 'types';

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

// components/RegularChannelView.tsx
interface RegularChannelViewProps {
    channel: ChannelType;
}

function RegularChannelView({ channel }: RegularChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <h2 className="text-xl font-semibold text-white mb-4">{channel.title}</h2>
            <div className="space-y-4">
                {/* {channel.Chats.map(message => (
          <MessageComponent key={message.id} message={message} />
        ))} */}
            </div>
        </div>
    );
}

// components/EventChannelView.tsx
interface EventChannelViewProps {
    channel: EventChannelType;
}

function EventChannelView({ channel }: EventChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <h2 className="text-xl font-semibold text-white mb-2">{channel.title}</h2>
            <p className="text-gray-300 mb-4">{channel.description}</p>
        </div>
    );
}

// components/WelcomeChannelView.tsx
interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

function WelcomeChannelView({ channel }: WelcomeChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] w-full p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Welcome</h2>
            <div className="text-gray-300 mb-4">{channel.welcomeMessage}</div>
            <div className="space-y-4">
                {/* <RecentJoinees users={channel.welcomedUsers} />
        <RoleRequests requests={channel.roleRequests} /> */}
            </div>
        </div >
    );
}