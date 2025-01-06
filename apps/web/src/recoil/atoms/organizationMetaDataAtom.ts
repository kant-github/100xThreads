import { atom } from "recoil";
import { ChannelType, EventChannelType, WelcomeChannel } from "types";

export const organizationEventChannels = atom<EventChannelType[] | []>({
    key: 'organizationEventChannels',
    default: []
})

export const organizationChannels = atom<ChannelType[] | []>({
    key: 'organizationChannels',
    default: []
})

export const organizationWelcomeChannel = atom<WelcomeChannel>({
    key: 'organizationWelcomeChannel',
    default: {} as WelcomeChannel
})

