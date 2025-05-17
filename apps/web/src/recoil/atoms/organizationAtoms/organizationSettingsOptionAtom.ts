import { atom } from "recoil";

export enum OrganizationSettingsOptionEnum {
    TAGS = 'tags'
}

export const organizationSettingsOptionAtom = atom<OrganizationSettingsOptionEnum>({
    key: 'organizationSettingsOptionAtom',
    default: OrganizationSettingsOptionEnum.TAGS
})