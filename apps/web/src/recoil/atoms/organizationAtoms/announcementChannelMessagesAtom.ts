import { atom } from "recoil";
import { AnnouncementType } from "types/types";

export const announcementChannelMessgaes = atom<AnnouncementType[]>({
    key: 'announcementChannelMessgaes',
    default: []
})