import { atom } from "recoil";

export enum OrganizationSettingsOptionEnum {
    TAGS = 'tags',
    USERS = 'users',
    LOCATION = 'location'
}

export const organizationSettingsOptionAtom = atom<OrganizationSettingsOptionEnum>({
    key: 'organizationSettingsOptionAtom',
    default: OrganizationSettingsOptionEnum.USERS
})