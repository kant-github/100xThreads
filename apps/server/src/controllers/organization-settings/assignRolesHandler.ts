import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function assignRolesHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { selectedUsers, role } = req.body;

    if (!selectedUsers || !Array.isArray(selectedUsers) || selectedUsers.length === 0) {
        res.status(400).json({ message: "No users selected" });
        return;
    }

    if (!role) {
        res.status(400).json({ message: "No roles selected" });
        return;
    }


    try {
        const result = await Promise.all(
            selectedUsers.flatMap(userId =>
                prisma.organizationUsers.update({
                    where: {
                        id: userId
                    }, data: {
                        role: role
                    },
                    include: {
                        user: true,
                        tags: true
                    }

                })
            )
        )

        console.log("result is : ", result);

        res.status(200).json({
            message: "Role assigned successfully",
            flag: 'SUCCESS',
            data: result
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