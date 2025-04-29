import { atom } from "recoil";
import { NotificationType } from "types/types";

export const NotificationAtom = atom<NotificationType[]>({
    key: 'NotificationAtom',
    default: []
})