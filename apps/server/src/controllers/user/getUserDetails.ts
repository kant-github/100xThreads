import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getUserDetails(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                message: "User ID is required",
            });
            return;
        }

        const userId = Number(id);

        const user = await prisma.users.findFirst({
            where: {
                id: userId
            },
            include: {
                Friends1: {
                    include: {
                        user2: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                                isOnline: true,
                                lastSeen: true
                            }
                        }
                    }
                },
                Friends2: {
                    include: {
                        user1: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                                isOnline: true,
                                lastSeen: true
                            }
                        }
                    }
                },
                Organizations: {
                    include: {
                        organization: true
                    }
                },
                OwnedOrganizations: true,
                Chats: true,
            }
        });

        if (!user) {
            res.status(404).json({
                message: "No user exists with this user ID",
            });
            return;
        }

        const responseData = {
            ...user,

        };

        res.status(200).json({
            message: "Successfully fetched the user details",
            data: responseData,
        });
        return;
    } catch (err) {
        console.error("Error in fetching user details:", err);
        res.status(500).json({
            message: "Error in finding the user details",
        });
        return;
    }
}