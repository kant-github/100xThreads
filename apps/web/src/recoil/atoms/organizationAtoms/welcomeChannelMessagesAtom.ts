import { atom } from "recoil";
import { WelcomedUserTypes } from "types";

export const welcomeChannelMessagesAtom = atom<WelcomedUserTypes[]>({
    key: 'welcomeChannelMessagesAtom',
    default: []
})