import { atom } from "recoil";
import { OrganizationUsersType } from "types/types";

export const organizationUsersAtom = atom<OrganizationUsersType[] | []>({
    key: 'organizationUsersAtom',
    default: []
})