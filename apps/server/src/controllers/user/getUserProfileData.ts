import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getUserProfileData(req: Request, res: Response) {
    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { organizationId, userId } = req.params;
    if (!userId) {
        res.status(400).json({
            message: "userId is required"
        });
        return;
    }

    const currentUserId = Number(req.user.id);
    const profileUserId = Number(userId);

    const sanitizedOrganizationId = organizationId === "undefined" ? undefined : organizationId;

    try {
        let userProfile: any = null;

        if (sanitizedOrganizationId) {
            userProfile = await prisma.organizationUsers.findUnique({
                where: {
                    organization_id_user_id: {
                        organization_id: organizationId!,
                        user_id: profileUserId
                    }
                },
                include: {
                    user: true
                }
            });

            if (!userProfile) {
                res.status(404).json({
                    message: 'User does not exist in this organization',
                });
                return;
            }
        } else {
            userProfile = await prisma.users.findUnique({
                where: {
                    id: profileUserId
                }
            });

            if (!userProfile) {
                res.status(404).json({
                    message: 'User not found',
                });
                return;
            }
        }

        const friendship = await prisma.friendship.findUnique({
            where: {
                user_id_1_user_id_2: {
                    user_id_1: Math.min(currentUserId, profileUserId),
                    user_id_2: Math.max(currentUserId, profileUserId)
                }
            }
        });

        const sentRequest = await prisma.friendRequest.findUnique({
            where: {
                sender_id_reciever_id: {
                    sender_id: currentUserId,
                    reciever_id: profileUserId
                }
            }
        });

        const recievedRequest = await prisma.friendRequest.findUnique({
            where: {
                sender_id_reciever_id: {
                    sender_id: profileUserId,
                    reciever_id: currentUserId
                }
            }
        });

        let friendshipStatus = "NOT_FRIENDS";

        if (friendship) {
            friendshipStatus = "FRIENDS";
        } else if (sentRequest) {
            friendshipStatus = `REQUEST_SENT_${sentRequest.status}`;
        } else if (recievedRequest) {
            friendshipStatus = `REQUEST_RECEIVED_${recievedRequest.status}`;
        }


        res.status(200).json({
            message: "Successfully fetched user profile data",
            data: userProfile,
            friendshipStatus,
            friendRequestId: sentRequest?.id || recievedRequest?.id || null
        });
        return;

    } catch (err) {
        console.error("Error fetching user profile data:", err);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
}
