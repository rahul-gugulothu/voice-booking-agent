import { getCalendar } from "../services/calendarService.js";

function getEventDate(dateText, timeText) {
  let eventDate = new Date();

  // Handle "Tomorrow"
  if (dateText.toLowerCase() === "tomorrow") {
    eventDate.setDate(eventDate.getDate() + 1);
  }

  // Parse time like "5 PM"
  const match = timeText.match(/(\d+)\s*(AM|PM)/i);

  if (match) {
    let hour = parseInt(match[1]);
    const period = match[2].toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    eventDate.setHours(hour);
    eventDate.setMinutes(0);
    eventDate.setSeconds(0);
    eventDate.setMilliseconds(0);
  }

  return eventDate;
}

export async function bookAppointment(details) {
  const calendar = await getCalendar();

  const startTime = getEventDate(details.date, details.time);

  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const event = {
    summary: details.title,

    description: "Created by AI Appointment Agent",

    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },

    end: {
      dateTime: endTime.toISOString(),
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