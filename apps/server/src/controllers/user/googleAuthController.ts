import { Request, Response } from "express";
import { GOOGLE_CONFIG, oauth2Client } from "../../config/google";

export default function googleAuthController(req: Request, res: Response) {

    const returnUrl = req.query.returnUrl as string || 'http://localhost:3000';

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: GOOGLE_CONFIG.SCOPES,
        prompt: 'consent',
        state: Buffer.from(JSON.stringify({ returnUrl })).toString('base64')
    });
    res.redirect(authUrl);
}