import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getAllOrganizations(req: Request, res: Response) {

    if (!req.user?.id) {
        return res.send("returned");
    }

    try {

        const data = await prisma.organization.findMany({
            where: {
                OrganizationUsers: {
                    some: {

                    }
                }
            },
            include: {
                owner: true
            },
            orderBy: {
                created_at: "desc"
            },

        });

        res.status(200).json({
            message: "Data is fetched successfully",
            data: data,
        });

    } catch (error) {
        console.error(error);
    }
}
