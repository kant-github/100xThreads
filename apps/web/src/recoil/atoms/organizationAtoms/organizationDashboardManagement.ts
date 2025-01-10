import { atom, selector } from 'recoil';
import { ChannelType, EventChannelType, WelcomeChannel } from 'types';



export const organizationChannelsAtom = atom<ChannelType[]>({
    key: 'organizationChannelsAtom',
    default: []
});

export const organizationEventChannelsAtom = atom<EventChannelType[]>({
    key: 'organizationEventChannelsAtom',
    default: []
});

export const organizationWelcomeChannelAtom = atom<WelcomeChannel | null>({
    key: 'organizationWelcomeChannelAtom',
    default: null
});

export const selectedChannelIdAtom = atom<string>({
    key: 'selectedChannelIdAtom',
    default: ''
});

export const selectedChannelSelector = selector({
    key: 'selectedChannelSelector',
    get: ({ get }) => {
        const channelId = get(selectedChannelIdAtom);
        const channels = get(organizationChannelsAtom);
        const eventChannels = get(organizationEventChannelsAtom);
        const welcomeChannel = get(organizationWelcomeChannelAtom);

        const regularChannel = channels.find(channel => channel.id === channelId);
        if (regularChannel) return { type: 'regular', data: regularChannel };

        const eventChannel = eventChannels.find(channel => channel.id === channelId);
        if (eventChannel) return { type: 'event', data: eventChannel };

        if (welcomeChannel?.id === channelId) {
            return { type: 'welcome', data: welcomeChannel };
        }
        return null;
    }
});