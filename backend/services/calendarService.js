import { google } from "googleapis";
import { getAuthenticatedClient } from "./auth.js";

export async function getCalendar() {
  const auth = await getAuthenticatedClient();

  return google.calendar({
    version: "v3",
    auth,
  });
}