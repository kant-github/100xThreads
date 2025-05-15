import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getProjectChannelMessages(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }

    const { id: channelId } = req.params;

    try {
        const data = await prisma.project.findMany({
            where: { channel_id: channelId },
            include: {
                members: {
                    include: {
                        organization_user: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                tasks: {
                    include: {
                        assignees: {
                            include: {
                                project_member: {
                                    include: {
                                        organization_user: {
                                            include: {
                                                user: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!data) {
            res.json({
                message: "There are no project data available"
            })
            return;
        }

        res.status(200).json({
            message: "Successfully fetched project data",
            data
        })
    } catch (err) {
        console.log("Error in fetching the project data");
    }
}