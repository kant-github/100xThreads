import { atom } from "recoil";
import { OrganizationUsersType } from "types";

export const organizationUserAtom = atom<OrganizationUsersType>({
    key: 'organizationUserAtom',
    default: {} as OrganizationUsersType
})