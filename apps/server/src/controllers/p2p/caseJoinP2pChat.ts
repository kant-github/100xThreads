import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function caseJoinP2pChat(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }
    console.log("hitted");

    const user1Id = Number(req.user.id);
    const user2Username = req.query.user_2_username as string;
    console.log("user id : ", user1Id);
    console.log("user 2 username : ", user2Username);

    if (!user1Id || !user2Username) {
        res.status(400).json({ error: 'Missing user ID or username' });
        return;
    }

    try {
        const [user1, user2] = await Promise.all([
            prisma.users.findUnique({
                where: { id: user1Id },
            }),
            prisma.users.findUnique({
                where: { username: user2Username },
            }),
        ]);

        if (!user1) {
            res.status(404).json({ error: 'User 1 not found' });
            return;
        }

        if (!user1.username) {
            res.status(200).json({ status: 'redirect_to_dashboard' });
            return;
        }

        if (!user2) {
            res.status(404).json({ error: 'User 2 not found' });
            return;
        }

        if (!user2.username) {
            res.status(200).json({ status: 'user2_has_no_username' });
            return;
        }

        console.log(user1);

        res.status(200).json({
            status: 'chat_allowed',
            user1: user1,
            user2: user2,
        });
        return;
    } catch (err) {
        res.status(401).json({
            message: 'Error in case join p2p chats',
        })
        return;
    }
}