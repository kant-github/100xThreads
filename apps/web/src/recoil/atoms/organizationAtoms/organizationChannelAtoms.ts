import { atom } from "recoil";
import { ChannelType, EventChannelType, WelcomeChannel } from "types/types";

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