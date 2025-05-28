import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getEventsByChannel(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { eventChannelId, organizationId } = req.params;
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

    try {
        const invitedEvents = await prisma.eventAttendee.findMany({
            where: {
                user_id: userId,
                event: {
                    event_room_id: eventChannelId
                }
            },
            orderBy: {
                event: {
                    start_time: 'desc'
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
        console.log("final data is : ", finaldata);

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