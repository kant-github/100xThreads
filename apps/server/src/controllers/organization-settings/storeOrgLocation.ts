import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function storeOrgLocation(req: Request, res: Response) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "You are not authorized" });
            return;
        }
        console.log(req.body);
        const { organization_id, mode, name, description, address, city } = req.body;

        const orgLocation = await prisma.organizationLocations.create({
            data: {
                organization_id,
                mode,
                name,
                address,
                city,
            }
        });

        res.status(201).json({
            message: "Organization location created successfully",
            data: orgLocation
        });
        return;

    } catch (error) {
        console.error("Error creating organization location:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}