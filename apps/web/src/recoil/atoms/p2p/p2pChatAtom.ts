import { atom } from "recoil";
import { ChatMessageOneToOneType } from "types/types";

export const p2pChatAtom = atom<ChatMessageOneToOneType[]>({
    key: 'p2pChatAtom',
    default: []
})