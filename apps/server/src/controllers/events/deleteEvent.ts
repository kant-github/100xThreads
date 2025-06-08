import { Request, Response } from "express";
import { RESPONSE_FLAGS } from "./updateEvent";
import prisma from "@repo/db/client";
import GoogleCalendarService from "../../calendar/googleCalendarService";
import isExpiredtoken from "../../config/isExpiredtoken";

export default async function deleteEvent(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
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

    try {
        const deletor = await prisma.users.findUnique({
            where: { id: req.user.id },
        });

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                event_room: {
                    select: {
                        google_calendar_id: true
                    }
                }
            }
        });

        if (!event) {
            res.status(404).json({
                flag: RESPONSE_FLAGS.ERROR,
                message: "Event not found",
                success: false
            });
            return;
        }

        if (!deletor?.access_token || !deletor.refresh_token ||
            (deletor.token_expires_at && isExpiredtoken(deletor.token_expires_at.toString()))) {
            res.status(200).json({
                flag: RESPONSE_FLAGS.CONNECT_CALENDAR,
                message: 'Event deleted locally, but Google Calendar sync requires reconnection',
                success: true,
            });
            return;
        }

        const googleCalendarService = new GoogleCalendarService(deletor.access_token, deletor.refresh_token);

        if (event.google_event_id && event.event_room?.google_calendar_id) {
            try {
                await googleCalendarService.deleteGoogleEvent(
                    event.event_room.google_calendar_id,
                    event.google_event_id
                );
            } catch (googleErr) {
                console.warn("Failed to delete event from Google Calendar:", googleErr);
            }
        }

        const deletedEvent = await prisma.event.delete({
            where: { id: event.id }
        });

        res.status(200).json({
            flag: RESPONSE_FLAGS.SUCCESS,
            message: "Event deleted successfully",
            success: true,
            deletedEvent
        });
        return;

    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({
            flag: RESPONSE_FLAGS.ERROR,
            message: "Something went wrong while deleting the event",
            success: false
        });
        return;
    }
}
