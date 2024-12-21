import { selector } from "recoil";

export const chatGroupsSelector = selector({
    key: "chatGroupsSelector",
    get: async ({get}) => {
        const token = get()
    }
})