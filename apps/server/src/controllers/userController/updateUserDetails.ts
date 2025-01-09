import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function updateUserDetails(req: Request, res: Response) {
    const user = req.user;

    if(!user) {
        res.status(403).json({
            message: "User is not authenticated"
        })
    }

    try {
        const updatedUser = await prisma.users.update({
            where: {
                id: Number(user?.id)
            },
            data: {
                name: req.body.name,
                bio: req.body.bio
            }
        })    
        
        res.status(200).json({
            message: "User updated successfully",
            updatedUser
        })

    } catch(err) {

    }
}
