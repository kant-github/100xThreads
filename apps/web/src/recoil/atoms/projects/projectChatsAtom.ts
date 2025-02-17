import { atom } from "recoil";
import { ProjectChatTypes } from "types";

export const projectChatsAtom = atom<ProjectChatTypes[]>({
    key: 'projectChatsAtom',
    default: []
})