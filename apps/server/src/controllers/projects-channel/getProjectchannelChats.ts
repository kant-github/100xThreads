import prisma from "@repo/db/client";
import { Request, Response } from "express";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export async function getProjectchannelChats(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const organizationId = req.params.organizationId;
    const channelId = req.params.channelId;
    const projectId = req.params.projectId;

    const cursor = req.query.cursor;
    const page_size = Math.min(Number(req.query.page_size) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    if (!organizationId || !channelId) {
        res.status(400).json({
            message: "Organization ID and Channel ID are required"
        });
        return;
    }

    try {
        const chats = await prisma.projectChat.findMany({
            where: {
                project_id: projectId
            },
            take: page_size + 1,
            ...(cursor ? {
                cursor: {
                    id: cursor.toString()
                },
                skip: 1
            } : {}),
            orderBy: {
                created_at: 'asc'
            },
            include: {
                organization_user: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                bio: true,
                                isOnline: true,
                                lastSeen: true
                            }
                        }
                    }
                },
                LikedUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        const hasMore = chats.length > page_size;
        if (hasMore) {
            chats.pop();
        }

        const transformedChats = chats.map(chat => ({
            ...chat,
            message: chat.is_deleted ? "[ This message has been deleted ]" : chat.message
        }));


        res.status(200).json({
            data: transformedChats,
            hasMore,
            nextCursor: hasMore ? chats[chats.length - 1]!.id : undefined
        })
        return;
    } catch (err) {
        console.error("Error in getiing project related chats", err);
    }
}