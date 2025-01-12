import { atom } from "recoil";
import { OrganizationType } from "types";

export const organizationAtom = atom<OrganizationType | null>({
    key: 'organizationAtom',
    default: null
})