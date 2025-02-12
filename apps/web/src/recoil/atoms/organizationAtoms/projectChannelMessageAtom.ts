import { atom } from "recoil";
import { ProjectTypes } from "types";

export const projectChannelMessageAtom = atom<ProjectTypes[]>({
    key: 'projectChannelMessageAtom',
    default: []
})