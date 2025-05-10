import { atom } from "recoil";

export const progressBarAtom = atom({
    key: "progressBarAtom",
    default: 0
})

export const progressBarTotalLevelAtom = atom({
    key: " progressBarTotalLevelAtom",
    default: 3
})

export const announcementFormProgressBarAtom = atom({
    key: "announcementFormProgressBarAtom",
    default: 0
})

export const announcementFormTotalLevelBarAtom = atom({
    key: "announcementFormTotalLevelBarAtom",
    default: 2
})

export const TaskFormProgressBarAtom = atom({
    key: "progressBarAtom",
    default: 0
})

export const TaskFormTotalLevelBarAtom = atom({
    key: " progressBarTotalLevelAtom",
    default: 3
})