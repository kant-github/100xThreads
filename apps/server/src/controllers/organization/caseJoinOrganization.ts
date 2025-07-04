import { Request, Response } from "express";
import { getOrganizationsMetaDeta } from "./getOrganizationsMetaDeta";
import prisma from "@repo/db/client";

export async function caseJoinOrganization(req: Request, res: Response) {
    const user = req.user;
    const { organizationId } = req.params;

    if (!user?.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
    }

    if (!organizationId) {
        res.status(400).json({ message: "Bad Request: Organization ID is required." });
        return;
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
                passwordSalt: true,
                tags: true,
                access_type: true,
                image: true,
                organizationColor: true,
                organization_type: true,
                created_at: true,
                WelcomeChannel: {
                    select: {
                        id: true,
                        welcome_message: true,
                        created_at: true
                    }
                }
            },

        })

        console.log("acess type is : ", organization?.access_type);
        if (organization?.access_type === 'PUBLIC') {
            const data = await getOrganizationsMetaDeta(organizationId, user.id);
            res.status(200).json({
                flag: 'ALLOWED',
                data: data
            })
            return;
        } else if (organization?.access_type === 'INVITE_ONLY') {
            res.status(201).json({
                flag: 'INVITE_ONLY',
                data: organization
            })
            return;
        }
        else {
            res.status(201).json({
                flag: 'PROTECTED',
                data: organization
            })
            return;
        }

    } catch (err) {
        console.log("Error catched");
    }
}