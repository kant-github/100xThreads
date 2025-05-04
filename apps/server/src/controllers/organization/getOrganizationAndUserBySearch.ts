import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getOrganizationAndUserBySearch(req: Request, res: Response) {
    try {
        const { name } = req.query;
        

        if (!name || typeof name !== "string") {
            res.status(400).json({ message: "Name query param is required" });
            return;
        }

        const searchQuery = name.trim();

        const users = await prisma.users.findMany({
            where: {
                name: {
                    contains: searchQuery,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            },
        });

        const organizations = await prisma.organization.findMany({
            where: {
                privateFlag: false,
                name: {
                    contains: searchQuery,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                image: true,
                organization_type: true,
            },
        });

        res.status(200).json({
            message: "Search completed",
            users,
            organizations,
        });
        return;

    } catch (err) {
        console.error("Error in search:", err);
        res.status(500).json({
            message: "Internal server error during search",
        });
        return;
    }
}
