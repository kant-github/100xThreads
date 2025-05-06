import { atom } from "recoil";
import { UserType } from "types/types";

export const p2pUser1Atom = atom<UserType>({
    key: 'p2pUser1Atom',
    default: {} as UserType
})