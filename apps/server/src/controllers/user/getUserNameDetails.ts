import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getUserNameDetails(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }

    const username = req.query.username as string;



    try {

        if (!username) {
            res.status(200).json({
                message: 'username does not exist',
            })
            return;
        }


        const user = await prisma.users.findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                bio: true,
            }
        });

        if (!user) {
            res.status(200).json({
                message: "Username is available",
                isTaken: false
            });
            return;
        }
        else {
            res.status(200).json({
                message: "Username is not available",
                isTaken: true
            });
            return;
        }

    } catch (err) {
        console.log("Error in getting user profile data details", err);
        res.status(500).json({
            message: "Error fetching user profile data"
        });
    }
}