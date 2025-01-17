import prisma from "@repo/db/client";
import { Request, Response } from "express";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export default async function getChats(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const organizationId = req.params.organizationId;
    const channelId = req.params.channelId;
    const cursor = req.query.cursor;
    const page_size = Math.min(Number(req.query.page_size) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    if (!organizationId || !channelId) {
        res.status(400).json({
            message: "Organization ID and Channel ID are required"
        });
        return;
    }


    try {
        const chats = await prisma.chats.findMany({
            where: {
                channel: {
                    organization_id: organizationId
                },
                channel_id: channelId
            },
            take: page_size + 1,
            ...(cursor && {
                cursor: {
                    id: cursor.toString()
                },
                skip: 1
            }),
            orderBy: {
                created_at: 'desc'
            },
            include: {

                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        const hasMore = chats.length > page_size;
        if (hasMore) {
            chats.pop();
        }

        res.status(200).json({
            data: chats,
            hasMore,
            nextCursor: hasMore ? chats[chats.length - 1]!.id : undefined
        })
    } catch (err) {

    }
}