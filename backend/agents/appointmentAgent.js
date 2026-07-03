import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function appointmentAgent(userMessage) {

  const prompt = `
You are an AI Appointment Booking Agent.

Your job is to collect:

- title
- date
- time

Rules:

1. If any information is missing, ask ONLY for the missing information.

2. If all information is available, return ONLY this JSON format.

{
  "status":"READY_TO_BOOK",
  "title":"Dentist Appointment",
  "date":"Tomorrow",
  "time":"5 PM"
}

VERY IMPORTANT:

- Return ONLY JSON.
- Do NOT explain.
- Do NOT write markdown.
- Do NOT write \`\`\`.
- Do NOT write READY_TO_BOOK outside the JSON.

User:
${userMessage}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text.trim();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}