import { atom } from "recoil";
import { OrganizationTagType } from "types/types";

export const organizationTagsAtom = atom<OrganizationTagType[]>({
    key: 'organizationTagsAtom',
    default: []
})