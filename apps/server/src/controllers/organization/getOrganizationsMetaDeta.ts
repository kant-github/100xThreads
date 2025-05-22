import prisma from "@repo/db/client";

export async function getOrganizationsMetaDeta(organizationId: string, userId: number) {
    try {
        const [organization, eventChannel, channels, organizationUsers, welcomeChannel, organizationUser, organizationTags] = await Promise.all([
            prisma.organization.findFirst({
                where: { id: organizationId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    owner_id: true,
                    access_type: true,
                    privateFlag: true,
                    image: true,
                    organizationColor: true,
                    organization_type: true,
                    created_at: true,
                    tags: true
                }
            }),
            prisma.eventChannel.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.channel.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.organizationUsers.findMany({
                where: { organization_id: organizationId },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            }),
            prisma.welcomeChannel.findFirst({
                where: { organization_id: organizationId }
            }),
            prisma.organizationUsers.findUnique({
                where: {
                    organization_id_user_id: {
                        user_id: Number(userId),
                        organization_id: organizationId!
                    }
                },
                include: { user: true }
            }),
            prisma.organizationTag.findMany({
                where: {
                    organization_id: organizationId
                }
            })
        ]);

        const data = {
            organization,
            eventChannel,
            channels,
            organizationUsers,
            welcomeChannel,
            organizationUser,
            organizationTags
        };
        return data;
    } catch (error) {
        console.log("error in catching metadata");
    }
}
