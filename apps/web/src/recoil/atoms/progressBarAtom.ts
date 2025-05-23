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

export const taskFormProgressBarAtom = atom({
    key: "taskFormProgressBarAtom",
    default: 0
})

export const taskFormTotalLevelBarAtom = atom({
    key: "taskFormTotalLevelBarAtom",
    default: 2
})

export const eventFormProgressBarAtom = atom({
    key: "eventFormProgressBarAtom",
    default: 0
})

export const eventFormTotalLevelBarAtom = atom({
    key: "eventFormTotalLevelBarAtom",
    default: 2
})