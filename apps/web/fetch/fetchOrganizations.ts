"use server"

import { ORGANIZATION } from "@/lib/apiAuthRoutes";

export async function fetchAllOrganization(token: string | null) {
    console.log("called");
    try {
        const res = await fetch(`${ORGANIZATION}-all`, {
            headers: {
                authorization: `Bearer ${token}`,
            }, next: {
                revalidate: 60 * 60,
                tags: ["dashboard"],
            }
        })

        if (!res.ok) {
            throw new Error("Failed to fetch all organization");
        }
        const organizations = await res.json();
        return organizations.data || [];
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
}