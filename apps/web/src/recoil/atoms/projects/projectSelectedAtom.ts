import { atom } from "recoil";
import { ProjectTypes } from "types/types";

export const projectSelectedAtom = atom<ProjectTypes | null>({
    key: 'projectSelectedAtom',
    default: null
})