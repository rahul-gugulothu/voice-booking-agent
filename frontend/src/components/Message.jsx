import { FaUserCircle, FaRobot } from "react-icons/fa";

function Message({ sender, text }) {
  const isLink = text.includes("https://");

  return (
    <div className={`message ${sender}`}>
      <div className="avatar">
        {sender === "user" ? <FaUserCircle /> : <FaRobot />}
      </div>

      <div className="message-bubble">
        {isLink ? (
          <>
            {text.split("https://")[0]}

            <br />
            <br />

            <a
              href={"https://" + text.split("https://")[1]}
              target="_blank"
              rel="noreferrer"
            >
              📅 Open Google Calendar
            </a>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
}

export default Message;