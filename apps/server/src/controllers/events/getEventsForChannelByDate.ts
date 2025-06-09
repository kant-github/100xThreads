import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getEventsForChannelByDate(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { eventChannelId, organizationId, date } = req.params;
    const userId = req.user.id;

    if (!eventChannelId) {
        res.status(400).json({
            success: false,
            flag: 'NOT_SUCCESS',
            message: "Event channel id not found"
        });
        return;
    }

    if (!organizationId) {
        res.status(400).json({
            success: false,
            flag: 'NOT_SUCCESS',
            message: "Organization id not found"
        });
        return;
    }

    if (!date) {
        res.status(400).json({
            success: false,
            flag: 'NOT_SUCCESS',
            message: "Date parameter not found"
        });
        return;
    }

    try {

        const targetDate = new Date(date);

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const invitedEvents = await prisma.eventAttendee.findMany({
            where: {
                user_id: userId,
                event: {
                    event_room_id: eventChannelId,
                    start_time: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
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


        const finaldata = invitedEvents.map((event) => event.event);

        res.status(200).json({
            data: finaldata,
            success: true,
            message: "successfully fetched all events"
        })
        return;

    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({
            success: false,
            flag: 'SERVER_ERROR',
            message: "Internal server error while fetching events"
        });
    }

}