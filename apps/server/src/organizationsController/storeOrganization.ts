import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function storeOrganization(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            message: "You are not authorized"
        })
    }

    const { name, description } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Organization's name is required"
        })
    }

    if (name.length > 100) {
        return res.status(400).json({
            message: "Organization name must be less than 100 characters"
        });
    }


    try {
        const existingOrg = await prisma.organization.findUnique({
            where: {
                name_owner_id: {
                    name: name,
                    owner_id: req.user.id
                }
            }
        });
    } catch (err) {

    }

}