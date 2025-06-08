import prisma from "@repo/db/client";
import { Request, Response } from "express";
import isExpiredtoken from "../../config/isExpiredtoken";
import GoogleCalendarService from "../../calendar/googleCalendarService";

export default async function connectChannelToGoogleCalendar(req: Request, res: Response) {
    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
    }

    const { eventChannelId } = req.params;

    if (!eventChannelId) {
        res.status(400).json({
            message: 'Event channel id is not found',
            success: false
        });
        return;
    }

    try {
        const eventChannel = await prisma.eventChannel.findUnique({
            where: { id: eventChannelId },
            include: {
                organization: { select: { name: true, id: true } }
            }
        });

        if (!eventChannel) {
            res.status(404).json({
                message: 'Event channel not found',
                success: false
            });
            return;
        }

        const userId = Number(req.user.id);
        const userToconnect = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (
            !userToconnect?.access_token ||
            !userToconnect.refresh_token ||
            (userToconnect.token_expires_at &&
                isExpiredtoken(userToconnect.token_expires_at.toString()))
        ) {
            res.status(200).json({
                message: 'You need to connect your Google Calendar account to proceed',
                success: false,
            });
            return;
        }

        if (eventChannel.google_calendar_id) {
            res.status(200).json({
                success: true,
                message: `${eventChannel.title} is already connected to Google Calendar`
            });
            return;
        }

        const googleCalendarService = new GoogleCalendarService(
            userToconnect.access_token,
            userToconnect.refresh_token
        );

        const googleCalendarId = await googleCalendarService.createGoogleCalendar(
            `${eventChannel.organization.name} - ${eventChannel.title}`
        );

        if (!googleCalendarId) {
            res.status(500).json({
                message: 'Failed to create Google Calendar',
                success: false
            });
            return;
        }

        const transactionData = await prisma.$transaction(async (tx) => {
            await tx.eventChannel.update({
                where: { id: eventChannel.id },
                data: { google_calendar_id: googleCalendarId }
            });

            const onlineLocations = await tx.organizationLocations.findFirst({
                where: {
                    mode: 'ONLINE',
                    organization_id: eventChannel.organization.id,
                }
            })
            let orgLocations;
            if (!onlineLocations) {
                orgLocations = await tx.organizationLocations.create({
                    data: {
                        mode: 'ONLINE',
                        organization_id: eventChannel.organization.id,
                        name: 'Google Meet',
                    }
                });
            }
            return orgLocations
        })

        res.status(200).json({
            success: true,
            message: 'Successfully connected to Google Calendar',
            eventChannelId: eventChannel.id,
            googleCalendarId,
            ...(transactionData && { orgLocation: transactionData })
        });
        return;

    } catch (err) {
        console.error("Error connecting to Google Calendar:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
        return;
    }
}
