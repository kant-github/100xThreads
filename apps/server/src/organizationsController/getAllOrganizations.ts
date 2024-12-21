import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getAllOrganizations(req: Request, res: Response) {
    if (!req.user) {
        return res.status(404).json({
            message: "You are not authorized"
        });
    }

    try {

        const data = await prisma.organization.findMany({
            where: {
                OrganizationUsers: {
                    some: {
                        user_id: req.user.id,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            },
            include: {
                OrganizationUsers: true,
            }
        });

        if (data.length === 0) {
            return res.status(200).json({
                message: "No organizations found where the user has joined",
                data: [],
            });
        }

        return res.status(200).json({
            message: "Data is fetched successfully",
            data: data,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error while fetching joined organizations",
        });
    }
}
