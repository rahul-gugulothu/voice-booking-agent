import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import "./styles/App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm your AI Appointment Booking Assistant.\n\nTell me when you'd like to schedule your appointment.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      <Navbar />

      <main className="main-container">
        <ChatBox
          messages={messages}
          loading={loading}
        />

        <ChatInput
          messages={messages}
          setMessages={setMessages}
          loading={loading}
          setLoading={setLoading}
        />
      </main>
    </div>
  );
}

export default App;