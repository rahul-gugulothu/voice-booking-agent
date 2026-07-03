import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { appointmentAgent } from "./agents/appointmentAgent.js";
import { bookAppointment } from "./tools/calendarTool.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Voice Booking Agent is Running...");
});

// Chat Route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Get AI Response
    const reply = await appointmentAgent(message);

    // If AI has all appointment details
    if (
      typeof reply === "object" &&
      reply.status === "READY_TO_BOOK"
    ) {
      const result = await bookAppointment(reply);

      return res.json({
        success: true,
        agent: reply,
        tool: result,
      });
    }

    // AI needs more information
    return res.json({
      success: true,
      agent: reply,
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});