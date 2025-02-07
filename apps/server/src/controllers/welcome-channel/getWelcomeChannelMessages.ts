import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getWelcomeChannelMessages(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }

    const channelId = req.params.channelId;
    console.log("channel id is : ", channelId);

    try {
        const data = await prisma.welcomedUser.findMany({
            where: {
                welcome_channel_id: channelId,
            },
            include: {
                user: true,
            }
        })

        if (!data) {
            res.status(200).json({
                message: "There are no welcome messages for this channel"
            })
            return;
        }
        res.status(200).json({
            message: "There are no welcome messages for this channel",
            data
        })
        return;
    } catch (err) {
        console.log("error is getting welcome messages", err);
    }
}