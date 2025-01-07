import prisma from "@repo/db/client";

// Types for organization access
type OrganizationAccess = {
    type: 'INVITE_ONLY' | 'PASSWORD_PROTECTED' | 'PUBLIC_WITH_APPROVAL' | 'PUBLIC';
    settings: {
        maxMembers?: number;
        autoApprove?: boolean;
        requireEmail?: boolean;
        requireEmailDomain?: string[];
    };
};

// Enhanced Organization model
type EnhancedOrganization = {
    ...Organization,
    access: OrganizationAccess;
    inviteCodes: {
        code: string;
        expiresAt: Date;
        maxUses: number;
        usedCount: number;
        createdBy: number; // user_id
    }[];
};

// Authentication middleware
const validateOrgAccess = async (
    userId: number,
    orgId: string,
    accessToken?: string,
    inviteCode?: string
): Promise<{
    allowed: boolean;
    reason?: string;
}> => {
    // 1. Check if user is already a member
    const existingMember = await prisma.organizationUsers.findUnique({
        where: {
            organization_id_user_id: {
                organization_id: orgId,
                user_id: userId,
            },
        },
    });

    if (existingMember) {
        return { allowed: true };
    }

    // 2. Get organization details
    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            OrganizationUsers: true,
        },
    });

    if (!org) {
        return { allowed: false, reason: 'Organization not found' };
    }

    // 3. Check access type and validate accordingly
    switch (org.access_type) {
        case 'PUBLIC':
            return { allowed: true };

        case 'PASSWORD_PROTECTED':
            if (!accessToken) {
                return { allowed: false, reason: 'Password required' };
            }
            const isValidPassword = await verifyPassword(accessToken, org.password);
            return {
                allowed: isValidPassword,
                reason: isValidPassword ? undefined : 'Invalid password'
            };

        case 'INVITE_ONLY':
            if (!inviteCode) {
                return { allowed: false, reason: 'Invite code required' };
            }
            const validInvite = await validateInviteCode(orgId, inviteCode);
            return {
                allowed: validInvite,
                reason: validInvite ? undefined : 'Invalid or expired invite code'
            };

        case 'PUBLIC_WITH_APPROVAL':
            // Create pending request
            await prisma.organizationJoinRequest.create({
                data: {
                    organization_id: orgId,
                    user_id: userId,
                    status: 'PENDING'
                }
            });
            return { allowed: false, reason: 'Approval required' };
    }
};

// Rate limiting for failed attempts
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
};

// Token generation for temporary access
const generateTemporaryAccess = (orgId: string, userId: number): string => {
    return jwt.sign(
        { orgId, userId, type: 'temporary_access' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
};