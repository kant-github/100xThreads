import prisma from "@repo/db/client";
import { Request, Response } from "express";

export default async function getOrganizationBySearch(req: Request, res: Response) {
    try {
        const { name } = req.query;
        const user = req.user;
        console.log("printing user is : ", user);
        console.log("printing : ", name);

        await new Promise(t => setTimeout(t, 1000));

        const existingOrg = await prisma.organization.findFirst({
            where: {
                name: {
                    equals: name?.toString(),
                    mode: "insensitive",
                },
                owner_id: user?.id,
            },
        });

        console.log("existing org is : ", existingOrg);


        if (existingOrg) {
            return res.status(200).json({
                message: "An organization with this name already exists.",
                exists: true,
            });
        }


        return res.status(200).json({
            message: "No organization found with this name.",
            exists: false,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error in searching for the organization.",
            exists: false,
        });
    }
}
