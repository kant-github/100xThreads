import prisma from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import { getOrganizationsMetaDeta } from "../controllers/organization/getOrganizationsMetaDeta";


export default async function alreadyUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const { id: organizationId } = req.params;

    if (!user?.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
    }

    if (!organizationId) {
        res.status(400).json({ message: "Bad Request: Organization ID is required." });
        return;
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
            res.status(200).json({
                flag: 'ALLOWED',
                data: data
            })
            return;
        }
        return next();
    } catch (err) {
        console.log("error in catch block");
    }
}
