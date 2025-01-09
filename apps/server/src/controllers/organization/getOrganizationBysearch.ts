import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getOrganizationBySearch(req: Request, res: Response) {
    try {
        const { name } = req.query;
        const user = req.user;

        const existingOrg = await prisma.organization.findFirst({
            where: {
                name: {
                    equals: name?.toString(),
                    mode: "insensitive",
                },
                owner_id: user?.id,
            },
        });

        if (existingOrg) {
            res.status(200).json({
                message: "An organization with this name already exists.",
                exists: true,
            });
            return;
        }

        res.status(200).json({
            message: "No organization found with this name.",
            exists: false,
        });
        return;
    } catch (err) {
        res.status(500).json({
            message: "Error in searching for the organization.",
            exists: false,
        });
        return;
    }
}
