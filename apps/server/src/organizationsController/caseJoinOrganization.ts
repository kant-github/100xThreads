import prisma from "@repo/db/client";
import { Request, Response } from "express";
import { getOrganizationsMetaDeta } from "./getOrganizationsMetaDeta";

export async function caseJoinOrganization(req: Request, res: Response) {
    const user = req.user;
    const { id: organizationId } = req.params;

    if (!user?.id) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }

    if (!organizationId) {
        return res.status(400).json({ message: "Bad Request: Organization ID is required." });
    }

    try {
        const organization = await prisma.organization.findUnique({
            where: {
                id: organizationId
            },
            select: {
                name: true,
                description: true,
                owner: true,
                tags: true,
                access_type: true,
                image: true,
                organizationColor: true,
                organization_type: true,
                created_at: true
            }
        })

        if (organization?.access_type === 'PUBLIC') {
            const data = await getOrganizationsMetaDeta(organizationId);
            return res.status(200).json({
                flag: 'ALLOWED',
                data: data
            })
        } else {
            return res.status(201).json({
                flag: 'PROTECTED',
                data: organization
            })
        }

    } catch (err) {
        console.log("Error catched");
    }
}