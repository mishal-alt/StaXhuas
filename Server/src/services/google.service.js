import { OAuth2Client } from 'google-auth-library';
import { calendar } from '@googleapis/calendar';
import User from '../models/User.js';

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

/**
 * Generate the Google Auth URL for the facilitator to connect their account.
 */
export const getAuthUrl = (state) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Critical for refresh tokens
    prompt: 'consent',
    scope: scopes,
    state: state?.toString()
  });
};

/**
 * Handle the callback from Google, exchange code for tokens, and save to user.
 */
export const handleAuthCallback = async (code, userId) => {
  const { tokens } = await oauth2Client.getToken(code);
  
  if (tokens.refresh_token) {
    await User.findByIdAndUpdate(userId, {
      googleRefreshToken: tokens.refresh_token,
      googleConnected: true
    });
  }

  return tokens;
};

/**
 * Create a Google Meet event for an interview.
 */
export const createMeetLink = async (facilitatorId, interviewDetails) => {
  const facilitator = await User.findById(facilitatorId).select('+googleRefreshToken');
  if (!facilitator || !facilitator.googleRefreshToken) {
    throw new Error('Facilitator Google account not connected.');
  }

  console.log('Creating Meet link for facilitator:', facilitatorId);
  oauth2Client.setCredentials({ refresh_token: facilitator.googleRefreshToken });
  const calendarInstance = calendar({ version: 'v3', auth: oauth2Client });

  // Parse time (handle "05:44 PM" or "17:44")
  let timeStr = interviewDetails.scheduledTime;
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  }

  // Convert date and time to ISO string
  const startDateTime = new Date(`${interviewDetails.scheduledDate}T${timeStr}`);
  if (isNaN(startDateTime.getTime())) {
    console.error('Invalid Date generated:', `${interviewDetails.scheduledDate}T${timeStr}`);
    throw new Error('Invalid date or time format.');
  }
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour

  const event = {
    summary: `Interview: ${interviewDetails.module} - ${interviewDetails.studentName}`,
    description: `Staxhaus Institute Management Application - Interview Evaluation.\nStudent: ${interviewDetails.studentName}\nEmail: ${interviewDetails.studentEmail}`,
    start: { dateTime: startDateTime.toISOString() },
    end: { dateTime: endDateTime.toISOString() },
    conferenceData: {
      createRequest: {
        requestId: `intv_${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    attendees: [
      { email: interviewDetails.studentEmail },
      { email: facilitator.email }
    ]
  };

  try {
    const response = await calendarInstance.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    });

    console.log('Meet Link Created:', response.data.hangoutLink);
    return response.data.hangoutLink;
  } catch (err) {
    console.error('Google API Error Details:', err.response?.data || err.message);
    throw err;
  }
};
