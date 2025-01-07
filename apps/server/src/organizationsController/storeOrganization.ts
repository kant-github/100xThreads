import prisma from "@repo/db/client";
import { Request, Response } from "express";

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
        return res.status(401).json({ message: "You are not authorized" });
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
        return res.status(400).json({ message: "Organization's name is required" });
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
            return res.status(400).json({ message: "An organization with this name already exists" });
        }

        const newOrganization = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: organizationName,
                    owner_id: Number(req.user?.id),
                    privateFlag: isPrivate === 'true',
                    access_type: hasPassword === 'true' ?  'PRIVATE' : 'PUBLIC',
                    password,
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
                    description: 'Welcome to Events! Create, manage, and discover upcoming events. From virtual meetups to in-person gatherings, this space helps you stay connected with the community. Join discussions, RSVP to events, and shape memorable experiences together.',
                }
            })

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

        return res.status(201).json({
            message: "Organization created successfully",
            data: newOrganization,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error in creating organization" });
    }
}


// Your backend API should then:

// Extract the salt and hash from the received password string (they're separated by ':')

// Use bcrypt to hash the password again before storing

// Store both the bcrypt hash and the original salt

// The backend (Express) would handle it like this:

// typescript

// Copy

// import bcrypt from 'bcrypt'; // In your organization creation route const { password } = req.body; if (password) { const [salt, clientHash] = password.split(':'); const bcryptHash = await bcrypt.hash(clientHash, 10); // Store both bcryptHash and salt in your database // You'll need both for verification later }, ok so now, my frontend is ready and send the backend 4fff8cc4816c488a365843239e108181:87c5ecf0cbc6b278e7d0c2ec31005df7b5a42d74d51326de872239c8c9fe9fac, separated by delimeter, Now how should my backend handle the flow ? the current backend code is : import prisma from "@repo/db/client";

// import { Request, Response } from "express";

// const channelTypeMap: Record<string, 'ANNOUNCEMENT' | 'GENERAL' | 'RESOURCE' | 'HELP_DESK' | 'PROJECT' | 'LEARNING'> = {

//     'announcements': 'ANNOUNCEMENT',

//     'general': 'GENERAL',

//     'resources': 'RESOURCE',

//     'help-desk': 'HELP_DESK',

//     'projects': 'PROJECT',

//     'learning': 'LEARNING'

// };

// export async function storeOrganization(req: Request, res: Response) {

//     if (!req.user) {

//         return res.status(401).json({ message: "You are not authorized" });

//     }

//     const {

//         organizationName,

//         image,

//         organizationColor,

//         presetChannels,

//         organizationTags,

//         isPrivate,

//         hasPassword,

//         password

//     } = req.body;

//     if (!organizationName?.trim()) {

//         return res.status(400).json({ message: "Organization's name is required" });

//     }

//     const validateHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

//     const resolvedOrganizationColor = validateHexColor(organizationColor) ? organizationColor : "#f7b602";

//     try {

//         const existingOrg = await prisma.organization.findUnique({

//             where: {

//                 name_owner_id: {

//                     name: organizationName,

//                     owner_id: req.user.id,

//                 },

//             },

//         });

//         if (existingOrg) {

//             return res.status(400).json({ message: "An organization with this name already exists" });

//         }

//         const newOrganization = await prisma.$transaction(async (tx) => {

//             const org = await tx.organization.create({

//                 data: {

//                     name: organizationName,

//                     owner_id: Number(req.user?.id),

//                     privateFlag: isPrivate === 'true',

//                     hasPassword: hasPassword === 'true',

//                     password,

//                     image: image || "",

//                     organizationColor: resolvedOrganizationColor,

//                     organization_type: "STARTUP",

//                     tags: organizationTags,

//                 },

//                 include: { owner: true },

//             });

//             await tx.eventChannel.create({

//                 data: {

//                     organization_id: org.id,

//                     title: 'Events',

//                     description: 'Welcome to Events! Create, manage, and discover upcoming events. From virtual meetups to in-person gatherings, this space helps you stay connected with the community. Join discussions, RSVP to events, and shape memorable experiences together.',

//                 }

//             })

//             await tx.organizationUsers.create({

//                 data: {

//                     organization_id: org.id,

//                     user_id: Number(req.user?.id),

//                     role: "ADMIN",

//                 },

//             });

//             await tx.welcomeChannel.create({

//                 data: {

//                     organization_id: org.id,

//                     welcome_message: "Welcome to our organization!"

//                 }

//             });

//             await tx.channel.createMany({

//                 data: presetChannels.map((channelId: string) => ({

//                     organization_id: org.id,

//                     title: channelId.charAt(0).toUpperCase() + channelId.slice(1).replace(/-/g, ' '),

//                     type: channelTypeMap[channelId] || 'GENERAL',

//                     created_by: Number(req.user?.id),

//                     allowed_roles: ["MEMBER"],

//                     description: Channel for ${channelId.replace(/-/g, ' ')}

//                 })),

//             });

//             return org;

//         });

//         return res.status(201).json({

//             message: "Organization created successfully",

//             data: newOrganization,

//         });

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({ message: "Error in creating organization" });

//     }

// }

