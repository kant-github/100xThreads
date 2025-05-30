import { atom } from "recoil";
import { EventType } from "types/types";

export const myEventsAtom = atom<EventType[]>({
    key: 'myEventsAtom',
    default: []
})