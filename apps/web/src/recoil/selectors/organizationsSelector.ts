import { selector } from "recoil";
import { userTokenAtom } from "../atoms/atom";
import { fetchAllOrganization } from "fetch/fetchOrganizations";

export const organizationsSelector = selector({
    key: "organizationsSelector",
    get: async ({ get }) => {
        const token = get(userTokenAtom);
        console.log("token in selector is : ", token);

        if (!token) {
            return;
        }

        try {
            const organizations = await fetchAllOrganization(token);
            return organizations;
        } catch (error) {
            console.error("Error fetching organizations:", error);
            return [];
        }
    }
})