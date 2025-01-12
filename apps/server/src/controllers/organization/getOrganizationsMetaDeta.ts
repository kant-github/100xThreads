import prisma from "@repo/db/client";

export async function getOrganizationsMetaDeta(organizationId: string) {


    try {
        const [organization, eventChannel, channels, organizationUsers, welcomeChannel] = await Promise.all([
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
                include: { user: true }
            }),
            prisma.welcomeChannel.findFirst({
                where: { organization_id: organizationId }
            })
        ]);



        const data = {
            organization,
            eventChannel,
            channels,
            organizationUsers,
            welcomeChannel
        };

        return data;


    } catch (error) {

    }
}
