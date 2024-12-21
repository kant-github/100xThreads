import { atom } from "recoil";
import { ChatGroupType } from "types";

export const chatGroupsAtom = atom<ChatGroupType[]>({
    key: "chatGroupsAtom",
    default: [] as ChatGroupType[],
});
