import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function updateUserDetails(req: Request, res: Response) {
    const user = req.user;
        console.log("hitted -> ", req.body.username);
    if (!user) {
        res.status(403).json({
            message: "User is not authenticated"
        })
        return;
    }

    try {
        const updatedUser = await prisma.users.update({
            where: {
                id: Number(user.id)
            },
            data: {
                name: req.body.name,
                bio: req.body.bio,
                username: req.body.username
            }
        })

        res.status(200).json({
            message: "User updated successfully",
            updatedUser
        })
        return;

    } catch (err) {
        console.error("Update error", err);
        res.status(500).json({
            message: "Failed to update user"
        });
        return;
    }
}
