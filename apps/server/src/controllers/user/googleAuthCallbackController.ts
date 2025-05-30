import { Request, Response } from "express";
import { oauth2Client } from "../../config/google";
import { google } from "googleapis";
import prisma from "@repo/db/client";

export default async function googleAuthCallbackController(req: Request, res: Response) {
    const { code, state } = req.query;

    let returnUrl = 'http://localhost:3000';
    try {
        if (state) {
            const decodedState = JSON.parse(Buffer.from(state as string, 'base64').toString());
            returnUrl = decodedState.returnUrl || returnUrl;
        }
    } catch (error) {
        console.error('Error parsing state:', error);
    }

    if (!code) {
        return res.redirect('http://localhost:3000?error=no_code');
    }

    try {

        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        const tokenExpiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: userInfo } = await oauth2.userinfo.get();

        if (!userInfo.email) {
            res.redirect(`http://localhost:3000?success=false&userId=${userInfo.email}`);
            return;
        }

        const user = await prisma.users.findUnique({
            where: {
                email: userInfo.email
            },
        })


        if (!user?.id) {
            res.redirect(`http://localhost:3000?success=false&userId=${userInfo.email}`);
            return;
        }

        await prisma.users.update({
            where: { id: user.id },
            data: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || user.refresh_token,
                token_expires_at: tokenExpiresAt,
                id_token: tokens.id_token,
                name: userInfo.name || user.name,
                image: userInfo.picture,
            }
        })

        const urlObj = new URL(returnUrl);
        res.redirect(urlObj.toString());
        return;

    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.redirect('http://localhost:3000?error=auth_failed');
        return;
    }
}