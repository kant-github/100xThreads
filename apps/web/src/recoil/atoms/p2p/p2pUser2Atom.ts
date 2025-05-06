import { atom } from "recoil";
import { UserType } from "types/types";

export const p2pUser2Atom = atom<UserType>({
    key: 'p2pUser2Atom',
    default: {} as UserType
})