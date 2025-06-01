

import { atom } from "recoil";
import { OrganizationTagType } from "types/types";

export const eventTagsAtom = atom<OrganizationTagType[]>({
    key: 'eventTagsAtom',
    default: []
})