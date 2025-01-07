import prisma from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import { getOrganizationsMetaDeta } from "../organizationsController/getOrganizationsMetaDeta";

export async function alreadyUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const { id: organizationId } = req.params;

    if (!user?.id) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }

    if (!organizationId) {
        return res.status(400).json({ message: "Bad Request: Organization ID is required." });
    }

    try {
        const alreadyUser = await prisma.organizationUsers.findUnique({
            where: {
                organization_id_user_id: {
                    organization_id: organizationId,
                    user_id: Number(user.id)
                }
            }
        })

        if (alreadyUser) {
            const data = await getOrganizationsMetaDeta(organizationId);
            return res.status(200).json({
                flag: 'ALLOWED',
                data: data
            })
        }
        return next();
    } catch (err) {
        console.log("error in catch block");
    }
}
