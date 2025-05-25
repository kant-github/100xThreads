import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getOrgLocations(req: Request, res: Response) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "You are not authorized" });
            return;
        }

        const { organization_id } = req.params;

        const orgLocations = await prisma.organizationLocations.findMany({
            where: {
                organization_id
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.status(200).json({
            message: "Organization locations retrieved successfully",
            data: orgLocations
        });
        return;
    } catch (error) {
        console.error("Error fetching organization locations:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}