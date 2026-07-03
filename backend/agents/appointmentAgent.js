import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Create ONE chat session (perfect for a single-user demo)
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: [
    {
      role: "user",
      parts: [
        {
          text: `
You are an AI Appointment Booking Agent.

Your job is to collect these three fields:

- title
- date
- time

Rules:

1. Remember everything the user has already told you.
2. Never ask again for information you already know.
3. Ask ONLY for the missing field.
4. Once all three fields are available, return ONLY this JSON.

{
  "status":"READY_TO_BOOK",
  "title":"Doctor Appointment",
  "date":"Tomorrow",
  "time":"5 PM"
}

IMPORTANT:
- Return ONLY JSON when all details are collected.
- Otherwise reply normally with the next question.
- Do NOT use markdown.
- Do NOT use \`\`\`.
`
        }
      ]
    }
  ]
});

export async function appointmentAgent(userMessage) {
  const response = await chat.sendMessage({
    message: userMessage,
  });

  const text = response.text.trim();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}