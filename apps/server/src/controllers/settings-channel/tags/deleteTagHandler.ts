import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function deleteTagHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }
    console.log("hitted");
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
        await prisma.organizationTag.delete({
            where: {
                id: tagId,
                organization_id: organizationId
            }
        });


        res.status(200).json({
            message: "Successfully deleted tag",
        });
        return;
    } catch (err) {
        console.error("Error in deleting tag: ", err);
        res.status(500).json({
            message: "Error in deleting tag"
        });
        return;
    }
}
