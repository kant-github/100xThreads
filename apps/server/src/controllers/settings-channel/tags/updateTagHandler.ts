import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function updateTagHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { name, description, color } = req.body;
    const { organizationId, tagId } = req.params;

    if (!organizationId) {
        res.status(400).json({
            message: "Organization id is required"
        });
        return;
    }

    if (!tagId) {
        res.status(400).json({
            message: "Tag id is required"
        });
        return;
    }

    try {
        const existingTag = await prisma.organizationTag.findFirst({
            where: {
                id: tagId,
                organization_id: organizationId
            }
        });

        if (!existingTag) {
            res.status(404).json({
                message: "Tag not found or does not belong to this organization"
            });
            return;
        }

        const updatedTag = await prisma.organizationTag.update({
            where: {
                id: tagId
            },
            data: {
                name: name,
                description: description,
                color: color,
            }
        });

        res.status(200).json({
            message: "Successfully updated tag",
            data: updatedTag
        });
        return;
    } catch (err) {
        console.error("Error in updating tag: ", err);
        res.status(500).json({
            message: "Error in updating tag"
        });
        return;
    }
}
