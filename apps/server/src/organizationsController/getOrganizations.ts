import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getOrganizations(req: Request, res: Response) {
    if (!req.user) {
        return res.status(404).json({
            message: "You are not authorized"
        })
    }

    try {
        const data = await prisma.organization.findMany({
            where: {
                owner_id: req.user.id
            },
            include: {
                owner: true
            },
            orderBy: {
                created_at: "desc"
            }
        })

        if (data.length === 0) {
            return res.status(200).json({
                message: "No organizations found for this user",
                data: []
            });
        }

        return res.status(200).json({
            message: "Data is fetched successfully",
            data: data
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while fetching organizations",
        });
    }
}