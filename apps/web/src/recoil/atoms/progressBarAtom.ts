import { atom } from "recoil";

export const progressBarAtom = atom({
    key: "progressBarAtom",
    default: 1
})

export const progressBarTotalLevelAtom = atom({
    key: " progressBarTotalLevelAtom",
    default: 3
})