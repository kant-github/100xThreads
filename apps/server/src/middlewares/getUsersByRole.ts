import prisma from "@repo/db/client";

export default async function getUsersByRole(tagIds: string[], organizationId: string) {
    if (!tagIds || tagIds.length === 0) return [];

    try {
        const orgUsers = await prisma.organizationUsers.findMany({
            where: {
                organization_id: organizationId,
                tags: {
                    some: {
                        tag_id: { in: tagIds }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        email: true,
                    }
                }
            }
        });

        return orgUsers;
    } catch (error) {
        console.error('Error fetching users by role:', error);
        return [];
    }
}