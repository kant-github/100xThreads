"use server"

import { CHAT_GROUP, CHAT_GROUP_USERS, ORGANIZATION } from "@/lib/apiAuthRoutes";
import { notFound } from "next/navigation";

export async function fetchGroups(token: string | null) {
    try {
        const res = await fetch(`${CHAT_GROUP}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
            next: {
                revalidate: 60 * 60,
                tags: ["dashboard"],
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }
        const groups = await res.json();
        return groups.data || [];
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
}

export async function fetchGroup(token: string, group_id: string | null) {
    try {
        const res = await fetch(`${CHAT_GROUP}-check/${group_id}`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            cache: "no-cache"
        });
        if (!res.ok) {
            return notFound();
        }
        const response = await res.json();
        if (response?.data) {
            return response?.data;
        }
    } catch (error) {
        console.error("Error fetching groups:", error);
        return notFound();
    }
}

export async function fetchChatGroupUsers(group_id: string) {
    try {
        if (!group_id) {
            return notFound();
        }
        const response = await fetch(`${CHAT_GROUP_USERS}?group_id=${group_id}`, {
            next: {
                revalidate: 60 * 60,
                tags: ["chat-group-users"],
            },
        });
        const data = await response.json();

        return data.data;
    } catch (err) {
        console.log("error", err);
    }
}
