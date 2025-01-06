import { atom } from "recoil";

export const organizationChannelOptionAtom = atom<string>({
    key: 'organizationChannelOptionAtom',
    default: ''
})