// Import required dependencies
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Organization join handler
export async function handleOrganizationJoin(
    req: Request,
    res: Response
): Promise<Response> {
    const { userId, orgId, accessToken, inviteCode } = req.body;

    try {
        // Validate access
        const accessResult = await validateOrgAccess(
            userId,
            orgId,
            accessToken,
            inviteCode
        );

        if (!accessResult.allowed) {
            return res.status(403).json({
                error: accessResult.reason
            });
        }

        // If allowed, add user to organization
        const member = await prisma.organizationUsers.create({
            data: {
                organization_id: orgId,
                user_id: userId,
                role: 'MEMBER'
            }
        });

        // Generate temporary access token
        const tempToken = generateTemporaryAccess(orgId, userId);

        return res.status(200).json({
            success: true,
            member,
            accessToken: tempToken
        });
    } catch (error) {
        console.error('Organization join error:', error);
        return res.status(500).json({
            error: 'Failed to process join request'
        });
    }
}

// Handle organization join requests
export async function handleJoinRequest(
    req: Request,
    res: Response
): Promise<Response> {
    const { requestId, approved, note } = req.body;

    try {
        const request = await prisma.organizationJoinRequest.findUnique({
            where: { id: requestId },
            include: { organization: true }
        });

        if (!request) {
            return res.status(404).json({ error: 'Join request not found' });
        }

        if (approved) {
            // Add user to organization
            await prisma.organizationUsers.create({
                data: {
                    organization_id: request.organization_id,
                    user_id: request.user_id,
                    role: 'MEMBER'
                }
            });
        }

        // Update request status
        await prisma.organizationJoinRequest.update({
            where: { id: requestId },
            data: {
                status: approved ? 'APPROVED' : 'REJECTED',
                response_note: note,
                updated_at: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            status: approved ? 'APPROVED' : 'REJECTED'
        });
    } catch (error) {
        console.error('Join request handling error:', error);
        return res.status(500).json({
            error: 'Failed to process join request'
        });
    }
}

// Create organization invite
export async function createOrganizationInvite(
    req: Request,
    res: Response
): Promise<Response> {
    const { orgId, createdById, maxUses = 1, expiresIn = '7d' } = req.body;

    try {
        // Generate unique invite code
        const code = generateUniqueCode();
        
        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days

        const invite = await prisma.organizationInvite.create({
            data: {
                organization_id: orgId,
                created_by_id: createdById,
                code,
                max_uses: maxUses,
                expires_at: expiresAt,
                used_count: 0
            }
        });

        return res.status(201).json({ invite });
    } catch (error) {
        console.error('Invite creation error:', error);
        return res.status(500).json({
            error: 'Failed to create invite'
        });
    }
}

// Utility function to generate unique codes
function generateUniqueCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Rate limiting middleware
export function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Initialize rate limiting (using Redis or similar recommended)
    const ip = req.ip;
    const endpoint = req.path;
    const key = `${ip}:${endpoint}`;

    // Implementation depends on your choice of rate limiting solution
    // Example using a simple in-memory store (not recommended for production)
    if (exceedsRateLimit(key)) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    next();
}

// Temporary access token generation
function generateTemporaryAccess(orgId: string, userId: number): string {
    return jwt.sign(
        { 
            orgId, 
            userId, 
            type: 'temporary_access',
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        process.env.JWT_SECRET!
    );
}