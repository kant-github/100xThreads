import { atom } from "recoil";
import { MessageType } from "types/types";

export const generalChatsAtom = atom<MessageType[]>({
    key: 'generalChatsAtom',
    default: []
})