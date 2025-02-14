import React, { useState } from "react";
import useLocation from "../hooks/useLocation";
import { encodeLocation } from "../utils/encodeLocation";
import "../styles/Modals.css";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { location, error } = useLocation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let encodedLocation = "";
  if (error) {
    encodedLocation = error;
  } else if (location) {
    encodedLocation = encodeLocation(location.lat, location.lng);
  } else {
    encodedLocation = "Loading location...";
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(encodedLocation);
      setCopied(true);
    } catch (err) {
      setCopied(false);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content info-modal-content">
        <button className="close-button" onClick={onClose}>×</button>

        <h2>Your Encoded Location</h2>
        <div className="copy-box">
          <input type="text" readOnly value={encodedLocation} />
          <button className="copy-button" onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="scroll-content">
          <h2>About Love at First Flight</h2>
          <p>
            This started as a Valentine's Day project—a simple way to send a heartfelt message to a loved one across the world.
            Somehow, in creating it, it became something more.
          </p>
          <p>
            It was in building this that I was reminded of something important. The internet doesn't just connect us, it makes possible
            the relationships we might never have had. It allows friendship to persist across continents, love to thrive across time zones,
            and bonds to stretch far beyond what once seemed possible.
          <p>
            This site is a tribute to the way technology bridges the distances between us. It's about taking a moment to be awed by it, to feel the wonder of a message making its way across the world, 
            reaching someone far in miles yet close in heart.
          </p>  
            It's about messages blinking through networks, racing beneath the ocean on fiber optic threads. 
            It's about paper airplanes. 
            It's about love in motion. 
          <p>
            It's about you. It's about me. 
            It's about the space between us, and how we keep finding ways to close it—again and again.
          </p>
          </p>
          <h2>
            Privacy Policy
          </h2>
          <p>
            Love at First Flight does not track or store personal data beyond what is necessary to display messages on the site. 
            When you send a message, your location is stored along with your text and publicly displayed on the site.
          </p>
          <p>
            Your location is not an exact pinpoint—it is obtained through your browser, encoded (not encrypted), and slightly altered for privacy. 
            However, the encoding process is deterministic, meaning that the same input will always yield the same output. We do not protect location 
            data beyond this adjustment, so users should be aware that their approximate location will be visible.
          </p>
          <p>
            Use of this site constitutes agreement to these terms.
          </p>
          <h2>
            Terms of Service
          </h2>
          <p>
            By submitting a message on Love at First Flight, you consent to:
          </p>
          <ul>
            <li>Your message being publicly visible to all site visitors.</li>
            <li>Your message and approximate location being stored indefinitely.</li>
            <li>The possibility of your message being used for future iterations, features, or presentations of this project.</li>
          </ul>
          <p>
            This project is meant to be a public space for shared expressions, and as such, submitted messages cannot be 
            edited or removed after being sent. If you are uncomfortable with your words being visible indefinitely, please do not submit a message.
          </p>
          <p>
            Use of this site constitutes agreement to these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
