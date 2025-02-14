import React, { useState } from "react";
import { decodeLocation, encodeLocation } from "../utils/encodeLocation";
import { supabase } from "../services/supabaseClient";
import useLocation from "../hooks/useLocation";
import "../styles/Modals.css";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { location: senderLocation } = useLocation();

  const validateAddress = (addr: string) => addr.trim().length === 8;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setError("");
    setSuccess("");
  };

  const isFormValid = validateAddress(address) && content.trim().length > 0;

  const handleSend = async () => {
    setError("");
    setSuccess("");
    if (!senderLocation) {
      setError("Unable to retrieve your location.");
      return;
    }
    let recipientCoords;
    try {
      recipientCoords = decodeLocation(address);
    } catch (err) {
      setError("Invalid recipient address format.");
      return;
    }
    if (
      recipientCoords.lat < -90 ||
      recipientCoords.lat > 90 ||
      recipientCoords.lng < -180 ||
      recipientCoords.lng > 180
    ) {
      setError("Recipient location coordinates are out of range.");
      return;
    }
    const senderEncoded = encodeLocation(senderLocation.lat, senderLocation.lng);
    if (address.toUpperCase() === senderEncoded.toUpperCase()) {
      setError("Recipient address cannot be the same as your address.");
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase.from("messages").insert([
      {
        sender_address: senderEncoded,
        recipient_address: address.toUpperCase(),
        letter_content: content,
        sender_lat: senderLocation.lat,
        sender_lng: senderLocation.lng,
        recipient_lat: recipientCoords.lat,
        recipient_lng: recipientCoords.lng,
      },
    ]);
    setLoading(false);
    if (dbError) {
      setError("Error sending message: " + dbError.message);
    } else {
      setSuccess("Message sent successfully!");
      setAddress("");
      setContent("");
    }
  };

  const handleClose = () => {
    setSuccess("");
    setError("");
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>Send a letter to someone you love.</h2>
        <p>
          Find their address by directing them to the question mark in the top left corner of the screen and input it in the address bar below.
        </p>
        <label>To:</label>
        <input type="text" placeholder="Addressed to" value={address} onChange={handleAddressChange} />
        <label>Content:</label>
        <textarea
          placeholder="Dear Charlotte, ..."
          rows={6}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError("");
            setSuccess("");
          }}
        />
        <p className="terms">
          By submitting, I agree to the <a>Terms of Use</a> and <a>Privacy Policy</a>.
        </p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button
          className={`send-button ${isFormValid ? "available" : ""}`}
          disabled={!isFormValid || loading}
          onClick={handleSend}
        >
          {loading ? "Sending..." : "SEND"}
        </button>
      </div>
    </div>
  ) : null;
};

export default LetterModal;
