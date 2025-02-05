import prisma from "@repo/db/client";
import { Request, Response } from "express";
import { AnnotationInstance } from "twilio/lib/rest/insights/v1/call/annotation";

export async function createAnnouncement(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }
    console.log(req.user);
    console.log("announcmeent creation statrted");
    console.log(req.body);
    const { channelId, organizationId } = req.params;
    const { title, content, priority, tags } = req.body;

    try {

        const orgUser = await prisma.organizationUsers.findUnique({
            where: {
                organization_id_user_id: {
                    user_id: Number(req.user.id),
                    organization_id: organizationId!
                }
            }
        });

        const announcement = await prisma.announcement.create({
            data: {
                channel_id: channelId!,
                title: title,
                content: content,
                priority: priority,
                tags: tags,
                creator_org_user_id: Number(orgUser?.id),
            },
            include: {
                creator: {
                    select: {
                        user: true
                    }
                }
            }
        })

        if (!announcement) {
            res.status(404).json({
                message: "Error in creating announcemnt"
            })
        }
        res.status(200).json({
            message: "Successfully created announcement",
            data: announcement
        })

    } catch (err) {
        console.log("Error in creating announcemeent", err);
    }
}