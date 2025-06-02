import { Request, Response } from "express";
import { getGoogleConfig } from "../../calendar/googleCalendarService";
import { google } from "googleapis";
import { getGoogleAuth2client } from "../../config/google";

export default function googleAuthController(req: Request, res: Response) {

    const returnUrl = req.query.returnUrl as string || process.env.FRONTEND_URL;
    const { config, oauth2Client } = getGoogleAuth2client();

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: config.SCOPES,
        prompt: 'consent',
        state: Buffer.from(JSON.stringify({ returnUrl })).toString('base64')
    });
    res.redirect(authUrl);
}