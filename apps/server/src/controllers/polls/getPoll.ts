import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getPoll(req: Request, res: Response) {
    const { channelId } = req.params;

    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
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
        })

        if(creatorPoll) {
            res.status(200).json({
                message: "Poll fetched successfully (creator access)",
                poll: creatorPoll
            })
            return;
        }

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
        })

        if (!poll) {
            res.status(411).json({
                message: "no polls"
            });
            return;
        }

        res.json({
            poll,
            message: "Poll fetched successfully"
        })
        return;

    } catch (err) {
        console.log("error while fetching polls ", err);
    }
}