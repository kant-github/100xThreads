import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function isValidOrganizationName(req: Request, res: Response) {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Missing or invalid 'name' query parameter" });
        return;
    }

    try {
        const existingOrg = await prisma.organization.findFirst({
            where: { name }
        });

        const isValid = !existingOrg;

        res.status(200).json({
            isValid
        });
        return;
    } catch (err) {
        console.error("Error checking organization name:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}
