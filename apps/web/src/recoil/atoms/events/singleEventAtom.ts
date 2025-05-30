import { atom } from "recoil";

interface SingleEventAtom {
    openModal: boolean;
    selectedEventId: string | null
}

export const singleEventAtom = atom<SingleEventAtom>({
    key: 'singleEventAtom',
    default: {} as SingleEventAtom
})