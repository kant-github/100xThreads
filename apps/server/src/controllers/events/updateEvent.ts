import prisma from "@repo/db/client";
import { Request, Response } from "express";
import getUsersByRole from "../../middlewares/getUsersByRole";
import GoogleCalendarService from "../../calendar/googleCalendarService";
import isExpiredtoken from "../../config/isExpiredtoken";
import { ContentAndApprovalsPage } from "twilio/lib/rest/content/v1/contentAndApprovals";

export const RESPONSE_FLAGS = {
    SUCCESS: 'SUCCESS',
    CONNECT_CALENDAR: 'CONNECT_CALENDAR',
    CALENDAR_INTEGRATION_FAILED: 'CALENDAR_INTEGRATION_FAILED',
    ERROR: 'ERROR'
} as const;

export default async function updateEvent(req: Request, res: Response) {

    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized: User not authenticated." });
            return;
        }

        const { organizationId, eventId } = req.params;
        if (!eventId || !organizationId) {
            res.status(400).json({
                flag: RESPONSE_FLAGS.ERROR,
                message: "Missing required parameters: eventId and organizationId are required",
                success: false
            });
            return;
        }

        const {
            id,
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

        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                attendees: {
                    select: {
                        user_id: true
                    }
                },
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
        })

        if (!existingEvent) {
            res.status(404).json({
                flag: RESPONSE_FLAGS.ERROR,
                message: "Event not found",
                success: false
            });
            return;
        }

        const newTagIds = Array.isArray(linkedTags) ? linkedTags.map(String) : [];
        const orgUsers = newTagIds.length > 0 ? await getUsersByRole(newTagIds, organizationId!) : ([])

        const newAttendeeUserIds = orgUsers.map(orgUser => orgUser.user_id);
        const currentAttendeesUserIds = existingEvent.attendees.map(attendees => attendees.user_id);

        const userIdsToAdd = newAttendeeUserIds.filter(userIds => !currentAttendeesUserIds.includes(userIds));
        const userIdsToRemove = currentAttendeesUserIds.filter(userIds => !newAttendeeUserIds.includes(userIds));

        const result = await prisma.$transaction(async (tx) => {
            const event = await tx.event.update({
                where: { id: eventId },
                data: {
                    ...(title && { title }),
                    ...(description !== undefined && { description }),
                    ...(start_time && { start_time: new Date(start_time) }),
                    ...(end_time && { end_time: new Date(end_time) }),
                    ...(event_room_id && { event_room_id }),
                    ...(location && { location_id: location }),
                    ...(status && { status }),
                    linkedTags: newTagIds
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
            })

            if (userIdsToRemove.length > 0) {
                await tx.eventAttendee.deleteMany({
                    where: {
                        event_id: event.id,
                        user_id: {
                            in: userIdsToRemove
                        }
                    }
                })
            }
            if (userIdsToAdd.length > 0) {
                const newAttendeesData = orgUsers
                    .filter(user => userIdsToAdd.includes(user.user_id))
                    .map(user => ({
                        user_id: user.user_id,
                        event_id: eventId,
                        status: "MAYBE" as const,
                    }));

                await tx.eventAttendee.createMany({
                    data: newAttendeesData,
                    skipDuplicates: true,
                });
            }



            return await tx.event.findUnique({
                where: {
                    id: eventId,
                },
                include: {
                    attendees: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                    id: true,
                                    email: true
                                }
                            }
                        }
                    },
                    location: true,
                    event_room: {
                        select: {
                            google_calendar_id: true
                        }
                    }
                }
            })
        })

        if (!result) {
            res.status(500).json({
                flag: RESPONSE_FLAGS.ERROR,
                message: "Failed to update event",
                success: false
            });
            return;
        }

        const updator = await prisma.users.findUnique({
            where: {
                id: req.user.id
            },
        })

        if (!updator?.access_token || !updator.refresh_token ||
            (updator.token_expires_at && isExpiredtoken(updator.token_expires_at.toString()))) {

            res.status(200).json({
                flag: RESPONSE_FLAGS.CONNECT_CALENDAR,
                message: 'Event updated successfully, but Google Calendar sync requires reconnection',
                success: true,
                data: result
            });
            return;
        }

        const isOnlineMode = result.location?.mode === 'ONLINE';

        // --------------------------------------------------------------------------------------> google service
        const attendeeEmails = result.attendees.map(attendee => ({
            email: attendee.user.email
        }))


        const googleManager = new GoogleCalendarService(updator.access_token, updator.refresh_token);
        if (existingEvent.google_event_id) {
            await googleManager.updateGoogleEvent(existingEvent.google_event_id, attendeeEmails, result.event_room.google_calendar_id!, result.title, result.description!, result.start_time, result.end_time!, isOnlineMode)

        } else {
            let googleResponse = await googleManager.createGoogleEvent(attendeeEmails, result.event_room.google_calendar_id!, result.title, result.description!, result.start_time, result.end_time!, isOnlineMode)
            await prisma.event.update({
                where: { id: eventId },
                data: {
                    google_event_id: googleResponse.id,
                    meet_link: googleResponse.hangoutLink,
                }
            });
        }

        const tags = await prisma.organizationTag.findMany({
            where: {
                id: {
                    in: result.linkedTags || []
                }
            }
        })
        res.status(200).json({
            flag: RESPONSE_FLAGS.SUCCESS,
            message: "Event updated and synced with Google Calendar successfully",
            success: true,
            data: result,
            tags
        });
        return;

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

