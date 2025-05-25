import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function deleteOrgLocation(req: Request, res: Response) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "You are not authorized" });
            return;
        }

        const { id } = req.params;

        await prisma.organizationLocations.delete({
            where: { id }
        });

        res.status(200).json({
            message: "Organization location deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting organization location:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}