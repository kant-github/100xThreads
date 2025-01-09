import prisma from "@repo/db/client";

export async function getOrganizationsMetaDeta(organizationId: string) {


    try {
        const [organization, eventChannel, channels, organizationUsers, welcomeChannel] = await Promise.all([
            prisma.organization.findFirst({
                where: { id: organizationId }
            }),
            prisma.eventChannel.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.channel.findMany({
                where: { organization_id: organizationId },
            }),
            prisma.organizationUsers.findMany({
                where: { organization_id: organizationId },
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