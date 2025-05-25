import { atom } from "recoil";
import { OrganizationLocationTypes } from "types/types";

export const organizationLocationsAtom = atom<OrganizationLocationTypes[]>({
    key: 'organizationLocationsAtom',
    default: []
})