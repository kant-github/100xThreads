import { atom } from "recoil";
import { UserType } from "types/types";

export const userProfileAtom = atom<UserType>({
    key: 'userProfileAtom',
    default: {} as UserType
})