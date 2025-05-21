import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function assignTagsHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { selectedUsers, assignedTags } = req.body;

    if (!selectedUsers || !Array.isArray(selectedUsers) || selectedUsers.length === 0) {
        res.status(400).json({ message: "No users selected" });
        return;
    }

    if (!assignedTags || !Array.isArray(assignedTags) || assignedTags.length === 0) {
        res.status(400).json({ message: "No tags selected" });
        return;
    }

    try {
        const result = await Promise.all(
            selectedUsers.flatMap((userId: Number) =>
                assignedTags.map((tagId: string) =>
                    prisma.organizationUserTag.upsert({
                        where: {
                            organization_user_id_tag_id: {
                                organization_user_id: Number(userId),
                                tag_id: tagId
                            }
                        },
                        update: {
                            assigned_at: new Date()
                        },
                        create: {
                            organization_user_id: Number(userId),
                            tag_id: tagId,
                            assigned_at: new Date()
                        }
                    })
                )
            )
        )

        res.status(200).json({
            message: "Tags assigned successfully",
            tagsAssigned: result.length,
            flag: 'SUCCESS'
        });
        return;
    } catch (error) {
        console.error("Error assigning tags:", error);
        res.status(500).json({
            message: "Failed to assign tags",
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return;
    }

}