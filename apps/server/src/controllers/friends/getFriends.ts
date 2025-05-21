import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getFriends(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }
    try {

        const friends1 = await prisma.users.findUnique({
            where: {
                id: Number(req.user?.id)
            },
            include: {
                Friends1: {
                    include: {
                        user2: true
                    }
                }
            }
        })

        const friends2 = await prisma.users.findUnique({
            where: {
                id: Number(req.user?.id)
            },
            include: {
                Friends2: {
                    include: {
                        user1: true
                    }
                }
            }
        })

        const mergedFriends = [...friends1?.Friends1.map(friend => friend.user2) || [], ...friends2?.Friends2.map(friend => friend.user1) || []];

        res.json({
            message: "done",
            data: mergedFriends
        })
        return;
    } catch (err) {
        console.error("error in fetching friends");
    }
}