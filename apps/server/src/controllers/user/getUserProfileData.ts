import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getUserProfileData(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }
    const { organizationId, userId } = req.params;
    if (!organizationId || !userId) {
        res.status(500).json({
            message: "organizationId or userId is not found"
        })
        return;
    }

    try {
        const currentUserId = Number(req.user.id);
        const profileUserId = Number(userId);

        const useorganizationUser = await prisma.organizationUsers.findUnique({
            where: {
                organization_id_user_id: {
                    organization_id: organizationId,
                    user_id: profileUserId
                }
            },
            include: {
                user: true
            }
        });

        // console.log("org user is : ", useorganizationUser);

        if (!useorganizationUser) {
            res.status(200).json({
                message: 'User does not exist',
            })
            return;
        }

        // Check if users are friends
        // Using the fact that user_id_1 is always the lower ID and user_id_2 is always the higher ID
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
        })

        const recievedRequest = await prisma.friendRequest.findUnique({
            where: {
                sender_id_reciever_id: {
                    sender_id: profileUserId,
                    reciever_id: currentUserId
                }
            }
        })

        // console.log("friendship is : ", friendship);
        let friendshipStatus = "NOT_FRIENDS";

        if (friendship) {
            friendshipStatus = "FRIENDS";
        } else if (sentRequest) {
            friendshipStatus = `REQUEST_SENT_${sentRequest.status}`;
        } else if (recievedRequest) {
            friendshipStatus = `REQUEST_RECEIVED_${recievedRequest.status}`;
        }

        // console.log("friendship status: ", friendshipStatus);

        res.status(200).json({
            message: "Successfully fetched the user details",
            data: useorganizationUser,
            isFriend: !!friendship // Convert to boolean
        });

        return;
    } catch (err) {
        console.log("Error in getting user profile data details", err);
        res.status(500).json({
            message: "Error fetching user profile data"
        });
    }
}