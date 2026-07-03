import { useState } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { sendMessage } from "../services/api";

function ChatInput({
  messages,
  setMessages,
  loading,
  setLoading,
}) {
  const [input, setInput] = useState("");

  // ==============================
  // Voice Recognition
  // ==============================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);

      setTimeout(() => {
        handleSend(transcript);
      }, 300);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };
  };

  // ==============================
  // Send Message
  // ==============================
  const handleSend = async (voiceText = null) => {
    const message = voiceText || input;

    if (!message.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      const data = await sendMessage(message);

      let aiText = "";

      // Normal AI text
      if (typeof data.agent === "string") {
        aiText = data.agent;
      }

      // Appointment booked
      else if (data.agent?.status === "READY_TO_BOOK") {
        aiText = `✅ Appointment Booked Successfully!

📌 Title: ${data.agent.title}

📅 Date: ${data.agent.date}

🕒 Time: ${data.agent.time}`;

        if (data.tool?.eventLink) {
          aiText += `

📎 Google Calendar:
${data.tool.eventLink}`;
        }
      }

      // Other object response
      else {
        aiText = data.agent.message || JSON.stringify(data.agent);
      }

      // Speak AI response
     // ==============================
// Speak only important responses
// ==============================
if ("speechSynthesis" in window) {
  window.speechSynthesis.cancel();

  let speechText = "";

  // Speak only when appointment is booked
  if (data.agent?.status === "READY_TO_BOOK") {
    speechText = `Congratulations! Your appointment has been booked successfully.
    ${data.agent.title}.
    ${data.agent.date}.
    ${data.agent.time}.`;
  }

  // Don't speak anything else
  if (speechText) {
    const utterance = new SpeechSynthesisUtterance(speechText);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Choose a nicer English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("female")
    ) || voices.find((voice) => voice.lang.startsWith("en"));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Unable to connect to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        disabled={loading}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        className="mic-btn"
        onClick={startListening}
        disabled={loading}
        title="Speak"
      >
        <FaMicrophone />
      </button>

      <button
        className="send-btn"
        onClick={() => handleSend()}
        disabled={loading}
        title="Send"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}

export default ChatInput;