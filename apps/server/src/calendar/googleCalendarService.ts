import { google } from 'googleapis';
import dotenv from 'dotenv';


dotenv.config();

export const GOOGLE_CONFIG = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI!,
    SCOPES: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
};


export default class GoogleCalendarService {

    private oAuthClient;
    private calendar;

    constructor(access_token: string, refresh_token: string) {
        this.oAuthClient = new google.auth.OAuth2(
            GOOGLE_CONFIG.CLIENT_ID,
            GOOGLE_CONFIG.CLIENT_SECRET,
            GOOGLE_CONFIG.REDIRECT_URI
        )
        this.oAuthClient.setCredentials({
            access_token,
            refresh_token
        });
        this.calendar = google.calendar({
            version: 'v3',
            auth: this.oAuthClient
        })
    }

    async createGoogleCalendar(calendarTitle: string) {
        const sharedCalendar = await this.calendar.calendars.insert({
            requestBody: {
                summary: `${calendarTitle} - Events`,
                description: `Events calendar for ${calendarTitle} organization`,

            }
        })

        const calendarId = sharedCalendar.data.id;
        if (!calendarId) {
            console.error("Error creating calendar :( ");
        }
        return calendarId;
    }

}