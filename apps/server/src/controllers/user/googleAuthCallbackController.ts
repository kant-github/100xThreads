import { Request, Response } from "express";
import { google } from "googleapis";
import prisma from "@repo/db/client";
import { getGoogleAuth2client } from "../../config/google";

export default async function googleAuthCallbackController(req: Request, res: Response) {
    const { code, state } = req.query;
    const { oauth2Client } = getGoogleAuth2client();
    let FRONTEND_URL = process.env.BASE_URL
    let returnUrl = FRONTEND_URL;
    try {
        if (state) {
            const decodedState = JSON.parse(Buffer.from(state as string, 'base64').toString());
            returnUrl = decodedState.returnUrl || returnUrl;
        }
    } catch (error) {
        console.error('Error parsing state:', error);
    }

    if (!code) {
        return res.redirect(`${returnUrl}/error=no_code`);
    }

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        const tokenExpiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: userInfo } = await oauth2.userinfo.get();

        if (!userInfo.email) {
            res.redirect(`${FRONTEND_URL}?success=false&userId=${userInfo.email}`);
            return;
        }

        const user = await prisma.users.findUnique({
            where: {
                email: userInfo.email
            },
        })


        if (!user?.id) {
            res.redirect(`${FRONTEND_URL}?success=false&userId=${userInfo.email}`);
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

        const urlObj = new URL(returnUrl!);
        res.redirect(urlObj.toString());
        return;

    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.redirect(`${FRONTEND_URL}?error=auth_failed`);
        return;
    }
}