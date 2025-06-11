import prisma from "@repo/db/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { getOrganizationsMetaDeta } from "./getOrganizationsMetaDeta";

export default async function (req: Request, res: Response) {
    const user = req.user;
    const { organizationId } = req.params;
    const { password } = req.body;

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
            where: { id: organizationId },
            select: {
                passwordHash: true,
                access_type: true
            }
        })
        if (organization?.access_type !== 'PRIVATE') {
            res.json({
                message: "This organization is not private"
            })
            return;
        }

        const [clientSalt, clientHash] = password.split(":");
        const submittedHash = clientHash + clientSalt;

        const isPasswordValid = await bcrypt.compare(submittedHash, organization?.passwordHash!);
        if (!isPasswordValid) {
            res.status(200).json({
                flag: 'PROTECTED',
                message: "Invalid password"
            });
            return;
        }

        await prisma.organizationUsers.create({
            data: {
                user_id: Number(user.id),
                organization_id: organizationId,
                role: 'MEMBER'
            }
        });

        const data = await getOrganizationsMetaDeta(organizationId, user.id);
        res.status(200).json({
            flag: "ALLOWED",
            data: data
        })
        return;

    } catch (err) {
        console.error('Organization join error:', err);
        res.status(500).json({
            message: "Failed to join organization"
        });
        return;
    }
}