import { atom } from "recoil";
import { MessageType } from "types";

export const generalChatsAtom = atom<MessageType[]>({
    key: 'generalChatsAtom',
    default: []
})