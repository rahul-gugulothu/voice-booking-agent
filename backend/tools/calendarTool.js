import { getCalendar } from "../services/calendarService.js";

export async function bookAppointment(details) {

  const calendar = await getCalendar();

  const now = new Date();

  const end = new Date(now.getTime() + 60 * 60 * 1000);

  const event = {
    summary: details.title,

    description: "Created by AI Appointment Agent",

    start: {
      dateTime: now.toISOString(),
      timeZone: "Asia/Kolkata",
    },

    end: {
      dateTime: end.toISOString(),
      timeZone: "Asia/Kolkata",
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return {
    success: true,
    eventLink: response.data.htmlLink,
  };
}