import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function deleteOrganizations(req: Request, res: Response) {
    const { id: organizationId } = req.params;
    if (!organizationId) {
        res.status(404).json({
            message: "Organization not found"
        })
        return;
    }

    try {
        const organization = await prisma.organization.findUnique({
            where: {
                id: organizationId
            }
        })

        if (!organization) {
            res.status(404).json({
                message: "Organization not found"
            })
            return;
        }

        if (organization.owner_id !== req.user?.id) {
            res.status(403).json({
                message: "You are not authorized to delete this organization"
            })
            return;
        }

        const data = await prisma.organization.delete({
            where: {
                id: organizationId
            }
        })

        res.status(200).json({
            message: "Organization deleted successfully",
            data: data
        })
        return;
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
        return;
    }
}