import React, { useState } from "react";
import "../styles/Modals.css";

interface Message {
  createdAt: string;
  letterContent: string;
}

interface MessageModalProps {
  messages: Message[];
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(',', '');
};

const MessageModal: React.FC<MessageModalProps> = ({ messages, onClose }) => {
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  if (messages.length === 1) {
    const msg = messages[0];
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2 className="modal-title">{formatDate(msg.createdAt)}</h2>
          <p className="single-message">{msg.letterContent}</p>
        </div>
      </div>
    );
  }

  if (selectedMessageIndex !== null) {
    const msg = messages[selectedMessageIndex];
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={() => setSelectedMessageIndex(null)}>&times;</button>
          <h2 className="modal-title">{formatDate(msg.createdAt)}</h2>
          <p className="single-message">{msg.letterContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Multiple letters have been sent to this location.</h2>
        <div className="message-list-container">
          {messages.map((msg, index) => (
            <div key={index} className="letter-box" onClick={() => setSelectedMessageIndex(index)}>
              <p className="unexpanded-letter">{formatDate(msg.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
