import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function storeOrganization(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            message: "You are not authorized"
        })
    }

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

        if (existingOrg) {
            return res.status(400).json({
                message: "An organization with this name already exists"
            })
        }

        const newOrganization = await prisma.organization.create({
            data: {
                name: name,
                description: "",
                owner_id: req.user.id,
                organization_type: type.toUpperCase()
            }
        })
        
        await prisma.organizationUsers.create({
            data: {
                organization_id: newOrganization.id,
                user_id: Number(req.user.id),
                role: "ADMIN"
            }
        })


        if (parsedSelectedGroups.includes("events")) {
            await prisma.eventRoom.create({
                data: {
                    organization_id: newOrganization.id,
                    title: "Event Room",
                    description: "Welcome to the Event Room, a dedicated space where connections are made, stories are shared, and moments come to life. Host events, engage with your community, and create memories that last beyond the day.",
                    created_by: Number(req.user.id)
                }
            })
        }

        const filteredSelectedGroups = parsedSelectedGroups.filter((grouptitle: string) => grouptitle !== "events");


        await prisma.chatGroup.createMany({
            data: filteredSelectedGroups.map((groupTitle: string) => ({
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