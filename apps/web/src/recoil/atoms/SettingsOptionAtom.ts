import { atom } from "recoil";

export enum settingsOptionEnum {
    Appearance,
    Visibility,
    Profile
}

export const settingsOptionAtom = atom<settingsOptionEnum>({
    key: "settingsOption",
    default: settingsOptionEnum.Appearance
})