import { atom } from "recoil";
import { OrganizationType } from "types/types";

export const organizationAtom = atom<OrganizationType | null>({
    key: 'organizationAtom',
    default: null
})

export const organizationIdAtom = atom<string | null>({
    key: 'organizationIdAtom',
    default: null
})