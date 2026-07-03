import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatBox({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <Message
          key={index}
          sender={msg.sender}
          text={msg.text}
        />
      ))}

      {loading && (
        <div className="message ai">
          <div className="message-bubble typing">
            AI is typing...
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatBox;