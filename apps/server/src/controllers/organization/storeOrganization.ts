import prisma from "@repo/db/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';


const channelTypeMap: Record<string, 'ANNOUNCEMENT' | 'GENERAL' | 'RESOURCE' | 'HELP_DESK' | 'PROJECT' | 'LEARNING'> = {
    'announcements': 'ANNOUNCEMENT',
    'general': 'GENERAL',
    'resources': 'RESOURCE',
    'help-desk': 'HELP_DESK',
    'projects': 'PROJECT',
    'learning': 'LEARNING'
};

export async function storeOrganization(req: Request, res: Response) {

    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const {
        organizationName,
        image,
        organizationColor,
        presetChannels,
        organizationTags,
        isPrivate,
        hasPassword,
        password
    } = req.body;

    if (!organizationName?.trim()) {
        res.status(400).json({ message: "Organization's name is required" });
        return;
    }


    let finalHash = "";
    let finalSalt = "";


    if (hasPassword === 'true' && password) {
        const [clientSalt, clientHash] = password.split(":");
        finalHash = await bcrypt.hash(clientHash + clientSalt, 10);

        finalSalt = clientSalt;
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
            res.status(400).json({ message: "An organization with this name already exists" });
            return;
        }

        const newOrganization = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: organizationName,
                    owner_id: Number(req.user?.id),
                    description: "This is the default description for your organization 🌻",
                    privateFlag: isPrivate === 'true',
                    access_type: hasPassword === 'true' ? 'PRIVATE' : 'PUBLIC',
                    passwordHash: finalHash,
                    passwordSalt: finalSalt,
                    image: image || "",
                    organizationColor: resolvedOrganizationColor,
                    organization_type: "STARTUP",
                    tags: organizationTags,
                },
                include: { owner: true },
            });

            await tx.eventChannel.create({
                data: {
                    organization_id: org.id,
                    title: 'Events',
                    description: 'Welcome to Events! Create, manage, and discover upcoming events.',
                }
            });

            await tx.organizationUsers.create({
                data: {
                    organization_id: org.id,
                    user_id: Number(req.user?.id),
                    role: "ADMIN",
                },
            });

            await tx.welcomeChannel.create({
                data: {
                    organization_id: org.id,
                    welcome_message: "Welcome to our organization!"
                }
            });

            await tx.channel.createMany({
                data: presetChannels.map((channelId: string) => ({
                    organization_id: org.id,
                    title: channelId.charAt(0).toUpperCase() + channelId.slice(1).replace(/-/g, ' '),
                    type: channelTypeMap[channelId] || 'GENERAL',
                    created_by: Number(req.user?.id),
                    allowed_roles: ["MEMBER"],
                    description: `Channel for ${channelId.replace(/-/g, ' ')}`
                })),
            });
            return org;
        });

        res.status(201).json({
            message: "Organization created successfully",
            data: newOrganization,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in creating organization" });
    }
}