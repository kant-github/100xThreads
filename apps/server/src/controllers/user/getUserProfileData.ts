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
        const useorganizationUser = await prisma.organizationUsers.findUnique({
            where: {
                organization_id_user_id: {
                    organization_id: organizationId,
                    user_id: Number(userId)
                }
            },
            include: {
                user: true
            }
        })

        if (!useorganizationUser) {
            res.status(200).json({
                message: 'User does not exist',
            })
            return;
        }



        res.status(200).json({
            message: "Succesfully fecthed the user details",
            data: useorganizationUser
        })
        return;
    } catch (err) {
        console.log("Error in getting user profile data details");
    }
}