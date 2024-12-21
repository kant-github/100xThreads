import { atom } from "recoil";
import { OrganizationType } from "types";

export const organizationsAtom = atom<OrganizationType[]>({
    key: "organizationsAtom",
    default: [] as OrganizationType[],
});
