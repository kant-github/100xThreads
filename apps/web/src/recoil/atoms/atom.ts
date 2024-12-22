import { CustomSession } from "app/api/auth/[...nextauth]/options";
import { atom } from "recoil";

export const userSessionAtom = atom({
    key: "userSessionAtom",
    default: {} as CustomSession,
})