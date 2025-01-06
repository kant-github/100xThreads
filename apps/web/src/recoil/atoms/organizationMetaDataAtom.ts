import { atom } from "recoil";
import { ChannelType, EventChannelType } from "types";

export const organizationEventChannels = atom<EventChannelType[] | []>({
    key: 'organizationEventChannels',
    default: []
})

export const organizationChannels = atom<ChannelType[] | []>({
    key: 'organizationChannels',
    default: []
})

