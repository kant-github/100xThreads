import { atom } from "recoil";
import { TaskTypes } from "types/types";

export const projectTasksAtom = atom<TaskTypes>({
    key: 'projectTasksAtom',
    default: {} as TaskTypes
})