import { atom } from "recoil";

export enum settingsOptionEnum {
    Appearance = "Appearance",
    Visibility = "Visibility",
    Profile = "Profile"
}


export const settingsOptionAtom = atom<settingsOptionEnum>({
    key: "settingsOption",
    default: settingsOptionEnum.Profile
})