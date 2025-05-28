import { atom } from "recoil";

export const eventssideBarAtom = atom<boolean>({
    key: 'eventssideBarAtom',
    default: false
})