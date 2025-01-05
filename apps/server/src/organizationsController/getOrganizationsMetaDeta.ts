import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getOrganizationsMetaDeta(req: Request, res: Response) {
    const { id: organizationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }

    if (!organizationId) {
        return res.status(400).json({ message: "Bad Request: Organization ID is required." });
    }

    try {
        const [eventRooms, rooms, organizationUsers] = await Promise.all([
            prisma.eventRoom.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.channel.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.organizationUsers.findMany({
                where: { organization_id: organizationId },
            }),
        ]);

        const data = {
            eventRooms,
            rooms,
            organizationUsers,
        };

        return res.status(200).json({
            data,
            message: "Successfully retrieved data.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: Unable to process the request.",
        });
    }
}
