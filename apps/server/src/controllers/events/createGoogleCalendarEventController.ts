import prisma from "@repo/db/client";
import { Request, Response } from "express";
import getUsersByRole from "../../middlewares/getUsersByRole";
import GoogleCalendarService from "../../calendar/googleCalendarService";
import isExpiredtoken from "../../config/isExpiredtoken";

const RESPONSE_FLAGS = {
    SUCCESS: 'SUCCESS',
    CONNECT_CALENDAR: 'CONNECT_CALENDAR',
    CALENDAR_INTEGRATION_FAILED: 'CALENDAR_INTEGRATION_FAILED',
    ERROR: 'ERROR'
} as const;

export default async function createGoogleCalendarEventController(req: Request, res: Response) {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized: User not authenticated." });
            return;
        }

        const { organizationId } = req.params;

        const {
            title,
            description,
            start_time,
            end_time,
            event_room_id,
            location,
            status,
            linkedTags,
            created_by,
        } = req.body;

        if (!title || !start_time || !end_time || !created_by || !location) {
            res.status(400).json({
                flag: RESPONSE_FLAGS.ERROR,
                message: "Missing required fields: title, start_time, end_time, created_by, and location are required",
                success: false
            });
            return;
        }

        const tagIds = Array.isArray(linkedTags) ? linkedTags.map(String) : [];

        const orgUsers = await getUsersByRole(tagIds, organizationId!);

        const newEvent = await prisma.event.create({
            data: {
                title: title,
                description,
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                location_id: location,
                status,
                created_by: Number(created_by),
                event_room_id,
                linkedTags: tagIds
            },
            include: {
                location: {
                    select: {
                        mode: true
                    }
                },
                event_room: {
                    select: {
                        google_calendar_id: true
                    }
                }
            }
        });

        if (orgUsers && orgUsers.length > 0) {
            await prisma.eventAttendee.createMany({
                data: orgUsers.map((user: { id: number, user_id: number }) => ({
                    user_id: user.user_id,
                    event_id: newEvent.id,
                    status: "MAYBE",
                })),
                skipDuplicates: true,
            });
        }

        const creator = await prisma.users.findUnique({
            where: { id: Number(created_by) },
            select: {
                access_token: true,
                refresh_token: true,
                token_expires_at: true
            }
        });

        const attendeeEmails: { email: string }[] = orgUsers ? orgUsers.map((user) => ({ email: user.user.email })) : [];
        const isOnlineMode = newEvent.location?.mode === 'ONLINE';

        if (!creator?.access_token || !creator.refresh_token || !creator.token_expires_at && isExpiredtoken(creator.token_expires_at!.toString())) {
            res.status(200).json({
                flag: RESPONSE_FLAGS.CONNECT_CALENDAR,
                message: 'As the event creator, you need to connect your Google Calendar account to proceed',
                success: true,
            })
            return;
        }
        let finalEvent;
        try {
            const googleManager = new GoogleCalendarService(creator.access_token, creator.refresh_token);
            const googleResponse = await googleManager.createGoogleEvent(
                attendeeEmails,
                newEvent.event_room.google_calendar_id!,
                newEvent.title,
                newEvent.description || '',
                newEvent.start_time,
                newEvent.end_time!,
                isOnlineMode
            );

            finalEvent = await prisma.event.update({
                where: { id: newEvent.id },
                data: {
                    meet_link: googleResponse.hangoutLink,
                    status: 'LIVE',
                    google_event_id: googleResponse.id
                },
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

        } catch (googleError) {
            console.error('Google Calendar integration failed:', googleError);
            res.status(201).json({
                flag: RESPONSE_FLAGS.CALENDAR_INTEGRATION_FAILED,
                message: "Event created successfully, but Google Calendar integration failed",
                success: true,
                data: finalEvent
            });

            return;
        }

        res.status(201).json({
            flag: RESPONSE_FLAGS.SUCCESS,
            message: "Event created and integrated with Google Calendar successfully",
            success: true,
            data: finalEvent
        });
        return;

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

