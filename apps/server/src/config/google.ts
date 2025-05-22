import { google } from 'googleapis';
import dotenv from 'dotenv';
import { GOOGLE_CONFIG } from '../calendar/googleCalendarService';
dotenv.config();


export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CONFIG.CLIENT_ID,
  GOOGLE_CONFIG.CLIENT_SECRET,
  GOOGLE_CONFIG.REDIRECT_URI
);