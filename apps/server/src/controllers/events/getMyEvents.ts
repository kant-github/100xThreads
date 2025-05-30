import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getMyEvents(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    try {
        const invitedEvents = await prisma.eventAttendee.findMany({
            where: {
                user_id: req.user.id,
            },
            orderBy: {
                event: {
                    start_time: 'asc'
                }
            },
            select: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        start_time: true,
                        end_time: true,
                        meet_link: true,
                        status: true,
                        location: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                mode: true
                            }
                        },
                        attendees: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        email: true
                                    }
                                },
                                status: true
                            }
                        }
                    }
                }
            }
        });

        const events = invitedEvents.length > 0 && invitedEvents.map(attendee => attendee.event);

        res.status(200).json({
            data: events,
            success: true,
            message: "successfully fetched all events"
        })
        return;
    } catch (err) {
        res.status(500).json({
            success: false,
            flag: 'SERVER_ERROR',
            message: "Internal server error while fetching events"
        });
    }
}