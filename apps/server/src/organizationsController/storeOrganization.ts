import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function storeOrganization(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            message: "You are not authorized"
        })
    }
    console.log("hello");
    console.log(req.body);

    const { name, description, selectedGroups, type } = req.body;

    const parsedSelectedGroups = JSON.parse(selectedGroups);


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
        console.log("existing org is : ", existingOrg);

        if (existingOrg) {
            return res.status(400).json({
                message: "An organization with this name already exists"
            })
        }

        console.log("parsed selected group is : ", parsedSelectedGroups);
        const newOrganization = await prisma.organization.create({
            data: {
                name: name,
                description: "",
                owner_id: req.user.id,
                organization_type: type.toUpperCase()
            }
        })

        console.log("new org is : ", newOrganization);


        await prisma.chatGroup.createMany({
            data: parsedSelectedGroups.map((groupTitle: string) => ({
                organization_id: newOrganization.id,
                title: groupTitle
            }))
        })

        return res.status(201).json({
            message: "Organization created carefully",
            data: newOrganization
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error in creating organizations",
        });
    }
}