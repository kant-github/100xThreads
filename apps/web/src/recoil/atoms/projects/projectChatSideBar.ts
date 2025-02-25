import { atom } from "recoil";

export const projectChatSideBar = atom<boolean>({
    key: 'projectChatSideBar',
    default: false
})