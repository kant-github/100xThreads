import { atom } from "recoil";
import { WelcomedUserTypes } from "types/types";

export const welcomeChannelMessagesAtom = atom<WelcomedUserTypes[]>({
    key: 'welcomeChannelMessagesAtom',
    default: []
})