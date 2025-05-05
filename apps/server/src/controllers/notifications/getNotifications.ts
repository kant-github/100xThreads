import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getNotifications(req: Request, res: Response) {
    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
    }
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: Number(req.user.id),
            },
            orderBy: {
                created_at: "desc",
            },
        });
        res.status(200).json({
            message: "Successfully fetched all notifications",
            data: notifications,
        });
        return;
    } catch (err) {
        console.error("Error in fetching notifications:", err);
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: err instanceof Error ? err.message : "Unknown error",
        });
        return;
    }
}
