import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function deleteOrganizations(req: Request, res: Response) {
    const { id: organizationId } = req.params;
    if (!organizationId) {
        return res.status(404).json({
            message: "Organization not found"
        })
    }

    try {
        const organization = await prisma.organization.findUnique({
            where: {
                id: organizationId
            }
        })

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found"
            })
        }

        if (organization.owner_id !== req.user?.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this organization"
            })
        }

        const data = await prisma.organization.delete({
            where: {
                id: organizationId
            }
        })

        return res.status(200).json({
            message: "Organization deleted successfully",
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}