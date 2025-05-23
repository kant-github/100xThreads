import { atom, selector } from 'recoil';
import { organizationChannelsAtom, organizationEventChannelsAtom, organizationWelcomeChannelAtom } from './organizationChannelAtoms';

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

        if (channelId === 'default') {
            return { type: 'default' }
        }
        if (channelId === 'org_settings') {
            return { type: 'org_settings' }
        }

        const regularChannel = channels.find(channel => channel.id === channelId);
        if (regularChannel) return { type: 'regular', data: regularChannel };

        const eventChannel = eventChannels.find(channel => channel.id === channelId);
        if (eventChannel) return { type: 'event', data: eventChannel };

        if (welcomeChannel?.id === channelId) {
            return { type: 'welcome', data: welcomeChannel };
        }
        return { type: 'default' };
    }
});