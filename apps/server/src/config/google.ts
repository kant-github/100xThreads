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

export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CONFIG.CLIENT_ID,
  GOOGLE_CONFIG.CLIENT_SECRET,
  GOOGLE_CONFIG.REDIRECT_URI
);