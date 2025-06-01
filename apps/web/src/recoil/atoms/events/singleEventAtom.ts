import { atom } from "recoil";
import { EventType } from "types/types";



export const singleEventAtom = atom<EventType | null>({
    key: 'singleEventAtom',
    default: {} as EventType
})