import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { name, description, color } = req.body;
    const { organizationId } = req.params;
    try {
        const tag = await prisma.organizationTag.create({
            data: {
                name: name,
                description: description,
                color: color,
                created_at: new Date(),
                organization_id: organizationId!
            }
        })
    } catch (err) {
        console.error("Error in storing tags : ", err);
    }

}