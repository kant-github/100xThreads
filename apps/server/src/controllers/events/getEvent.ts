import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getEvent(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { eventId } = req.params;

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                attendees: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                                id: true
                            }
                        }
                    }
                },
                location: true
            }
        })

        const tags = await prisma.organizationTag.findMany({
            where: {
                id: {
                    in: event?.linkedTags || []
                }
            }
        })
        console.log(event);

        res.json({
            success: true,
            flag: 'SUCCESS',
            event,
            tags
        })
        return;
    } catch (err) {
        console.error("Error in fetching singular event", err);
    }
}