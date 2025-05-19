import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function storeTagHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { name, description, color } = req.body;
    const { organizationId } = req.params;
    console.log(req.body);

    if (!organizationId) {
        res.json({
            message: "Organization id is not found"
        })
        return;
    }
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

        if (!tag) {
            res.json({
                message: "Unable to create tag"
            })
            return;
        }
        res.status(200).json({
            message: "Successfully created tag",
            data: tag
        })
        return;
    } catch (err) {
        console.error("Error in storing tags : ", err);
        res.status(500).json({
            message: "Error in creating tags"
        });
    }

}