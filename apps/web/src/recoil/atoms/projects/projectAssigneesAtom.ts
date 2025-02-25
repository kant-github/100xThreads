import { atom } from "recoil";
import { TaskAssigneeType } from "types/types";

export const projectAssigneesAtom = atom<TaskAssigneeType[]>({
    key: 'projectAssigneesAtom',
    default: []
}) 