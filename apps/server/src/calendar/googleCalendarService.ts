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

    public async createGoogleCalendar(calendarTitle: string) {
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

    public async createGoogleEvent(
        userEmails: { email: string }[],
        calendarId: string,
        title: string,
        description: string,
        startTime: Date,
        endTime: Date,
        includeMeet: boolean
    ) {
        try {
            const googleEvent = await this.calendar.events.insert({
                calendarId: calendarId,
                conferenceDataVersion: includeMeet ? 1 : 0,
                requestBody: {
                    summary: title, description: description,
                    start: {
                        dateTime: new Date(startTime).toISOString()
                    },
                    end: {
                        dateTime: new Date(endTime).toISOString()
                    },
                    attendees: userEmails,
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 10 },
                            { method: 'popup', minutes: 10 }
                        ]
                    },
                    ...(includeMeet && {
                        conferenceData: {
                            createRequest: {
                                requestId: `meet-${Date.now()}`,
                                conferenceSolutionKey: {
                                    type: 'hangoutsMeet'
                                }
                            }
                        }
                    })
                }
            });

            return googleEvent.data;
        } catch (error) {
            console.error("Error creating Google Calendar event:", error);
            throw error;
        }
    }

    public async updateGoogleEvent(
        eventId: string,
        userEmails: { email: string }[],
        calendarId: string,
        title: string,
        description: string,
        startTime: Date,
        endTime: Date,
        includeMeet: boolean
    ) {
        try {
            const existingEvent = await this.calendar.events.get({
                calendarId: calendarId,
                eventId: eventId
            })
            console.log("existing events is : ", existingEvent);
            const updatedGoogleEvent = await this.calendar.events.update({
                calendarId: calendarId,
                conferenceDataVersion: includeMeet ? 1 : 0,
                eventId: eventId,
                requestBody: {
                    summary: title,
                    description: description,
                    start: {
                        dateTime: new Date(startTime).toISOString()
                    },
                    end: {
                        dateTime: new Date(endTime).toISOString()
                    },
                    attendees: [...userEmails, { email: '2610pr@gmail.com' }, { email: 'anjansuman75.sths@gmail.com' }],
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 10 },
                            { method: 'popup', minutes: 10 }

                        ]
                    },
                    ...(includeMeet && {
                        conferenceData: existingEvent.data.conferenceData || {
                            createRequest: {
                                requestId: `meet-${Date.now()}`,
                                conferenceSolutionKey: {
                                    type: 'hangoutsMeet'
                                }
                            }
                        }
                    })
                }
            })

            return updatedGoogleEvent.data
        } catch (err) {
            console.error("Error in updating google calendar event", err);
        }
    }

}