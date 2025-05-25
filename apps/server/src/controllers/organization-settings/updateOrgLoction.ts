import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function updateOrgLocation(req: Request, res: Response) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "You are not authorized" });
            return;
        }

        const { id } = req.params;
        const { mode, name, description, address, city } = req.body;

        const orgLocation = await prisma.organizationLocations.update({
            where: { id },
            data: {
                mode,
                name,
                description,
                address,
                city,
                updated_at: new Date(),
            }
        });

        res.status(200).json({
            message: "Organization location updated successfully",
            data: orgLocation
        });

    } catch (error) {
        console.error("Error updating organization location:", error);
        res.status(404).json({ message: "Organization location not found" });
        return;
    }
}

