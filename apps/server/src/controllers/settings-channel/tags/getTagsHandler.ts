import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getTagsHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { organizationId } = req.params;

    if (!organizationId) {
        res.json({
            message: "Organization id is not found"
        })
        return;
    }
    try {
        const tags = await prisma.organizationTag.findMany({
            where: {
                organization_id: organizationId
            }
        })

        if (!tags) {
            res.json({
                message: "Unable to get tags"
            })
            return;
        }
        res.status(200).json({
            message: "Successfully fetched all tags",
            data: tags
        })
        return;
    } catch (err) {
        console.error("Error in getting all tags : ", err);
        res.status(500).json({
            message: "Error in creating tags"
        });
        return;
    }
}