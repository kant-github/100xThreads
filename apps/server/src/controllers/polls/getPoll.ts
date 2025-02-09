import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getPoll(req: Request, res: Response) {
    const { channelId } = req.params;
    
    if (!req.user?.id) {
        return res.status(401).json({ 
            message: "Unauthorized: User not authenticated." 
        });
    }

    try {
        const creatorPoll = await prisma.poll.findFirst({
            where: {
                channel_id: channelId,
                status: 'ACTIVE',
                creator_id: Number(req.user.id)
            },
            include: {
                options: true,
                votes: {
                    select: {
                        option_id: true,
                        user_id: true
                    }
                },
                creator: true
            }
        });

        if (!creatorPoll) {
            const poll = await prisma.poll.findFirst({
                where: {
                    channel_id: channelId,
                    status: 'ACTIVE',
                    votes: {
                        none: {
                            user_id: Number(req.user.id)
                        }
                    }
                },
                include: {
                    options: true,
                    votes: {
                        select: {
                            option_id: true
                        }
                    },
                    creator: true
                }
            });

            if (!poll) {
                return res.status(404).json({
                    message: "No active polls found"
                });
            }

            return res.status(200).json({
                poll,
                message: "Poll fetched successfully"
            });
        }

        const currentTime = new Date();
        const pollExpiryTime = new Date(creatorPoll.expires_at!);

        if (currentTime > pollExpiryTime) {
            await prisma.poll.update({
                where: { id: creatorPoll.id },
                data: { status: 'ENDED' }
            });

            return res.status(200).json({
                message: "Poll has ended",
                poll: {
                    ...creatorPoll,
                    status: 'ENDED'
                }
            });
        }

        return res.status(200).json({
            message: "Poll fetched successfully (creator access)",
            poll: creatorPoll
        });

    } catch (err) {
        console.error("Error while fetching polls:", err);
        return res.status(500).json({
            message: "Internal server error while fetching polls"
        });
    }
}