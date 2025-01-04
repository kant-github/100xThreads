import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function storeOrganization(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            message: "You are not authorized",
        });
    }

    const { organizationName, image, organizationColor, isPrivate, hasPassword, password } = req.body;

    const presetChannels: string[] = Object.entries(req.body)
        .filter(([key]) => key.startsWith("presetChannels["))
        .map(([_, value]) => String(value));

    const organizationTags: string[] = Object.entries(req.body)
        .filter(([key]) => key.startsWith("organizationTags["))
        .map(([_, value]) => String(value));

    if (!organizationName || organizationName.trim() === "") {
        return res.status(400).json({
            message: "Organization's name is required",
        });
    }

    const validateHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

    const resolvedOrganizationColor = validateHexColor(organizationColor) ? organizationColor : "#f7b602";

    try {
        const existingOrg = await prisma.organization.findUnique({
            where: {
                name_owner_id: {
                    name: organizationName,
                    owner_id: req.user.id,
                },
            },
        });

        if (existingOrg) {
            return res.status(400).json({
                message: "An organization with this name already exists",
            });
        }

        const newOrganization = await prisma.organization.create({
            data: {
                name: organizationName,
                owner_id: req.user.id,
                privateFlag: Boolean(isPrivate),
                hasPassword: Boolean(hasPassword),
                password,
                image: image || "",
                organizationColor: resolvedOrganizationColor,
                organization_type: "STARTUP",
                tags: organizationTags,
            },
            include: {
                owner: true,
            },
        });

        await prisma.organizationUsers.create({
            data: {
                organization_id: newOrganization.id,
                user_id: Number(req.user.id),
                role: "ADMIN",
            },
        });

        if (presetChannels.includes("events")) {
            await prisma.eventRoom.create({
                data: {
                    organization_id: newOrganization.id,
                    title: "Event Room",
                    description:
                        "Welcome to the Event Room, a dedicated space where connections are made, stories are shared, and moments come to life. Host events, engage with your community, and create memories that last beyond the day.",
                    created_by: Number(req.user.id),
                },
            });
        }

        const filteredSelectedGroups = presetChannels.filter(
            (groupTitle: string) => groupTitle !== "events"
        );

        await prisma.chatGroup.createMany({
            data: filteredSelectedGroups.map((groupTitle: string) => ({
                organization_id: newOrganization.id,
                title: groupTitle,
            })),
        });

        return res.status(201).json({
            message: "Organization created successfully",
            data: newOrganization,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error in creating organizations",
        });
    }
}
