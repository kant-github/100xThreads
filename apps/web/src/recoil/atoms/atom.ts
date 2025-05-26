import { CustomSession } from "app/api/auth/[...nextauth]/options";
import { atom } from "recoil";

export const userSessionAtom = atom<CustomSession>({
    key: "userSessionAtom",
    default: {} as CustomSession,
})

export const createOrganizationAtom = atom<boolean>({
    key: "createOrganizationAtom",
    default: false
})

export enum DisplayType {
    list,
    grid
}

export const allOrganizationDisplaytype = atom<DisplayType>({
    key: "allOrganizationDisplaytype",
    default: DisplayType.list
})

export const ownedByYouOrganizationDisplayType = atom<DisplayType>({
    key: "ownedByYouOrganizationDisplayType",
    default: DisplayType.list
})