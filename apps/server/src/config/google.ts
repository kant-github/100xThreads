import { google } from 'googleapis';
import { getGoogleConfig } from '../calendar/googleCalendarService';

export function getGoogleAuth2client() {

  const config = getGoogleConfig();
  const oauth2Client = new google.auth.OAuth2(
    config.CLIENT_ID,
    config.CLIENT_SECRET,
    config.REDIRECT_URI
  );
  return { config, oauth2Client };

}

