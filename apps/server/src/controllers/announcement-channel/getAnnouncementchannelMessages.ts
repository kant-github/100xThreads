import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getAnnouncementChannelMessages(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }

    const { channelId } = req.params;

    try {
        const data = await prisma.announcement.findMany({
            where: { channel_id: channelId },
            include: {
                creator: {
                    select: {user: true}
                },
                AckStatus: true
            }
        })

        if (!data) {
            res.json({
                message: "There are no announcement data available"
            })
            return;
        }

        res.status(200).json({
            message: "Successfully fetched announcemnt data",
            data
        })
    } catch (err) {
        console.log("Error in fetching the annoucement data");
    }
}