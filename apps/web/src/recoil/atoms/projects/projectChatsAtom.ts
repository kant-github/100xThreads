import { atom } from "recoil";
import { ProjectChatTypes } from "types/types";

export const projectChatsAtom = atom<ProjectChatTypes[]>({
    key: 'projectChatsAtom',
    default: []
})