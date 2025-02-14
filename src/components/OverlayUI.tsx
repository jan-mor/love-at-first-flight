import React, { useState } from "react";
import envelopeIcon from "../assets/envelope.svg"; 
import questionMarkIcon from "../assets/question-mark.svg";
import LetterModal from "./SendLetterModal";
import InfoModal from "./InfoModal";
import '../styles/OverlayUI.css';

const OverlayUI: React.FC = () => {
  const [isLetterModalOpen, setLetterModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  const handleTitleClick = () => {
    window.dispatchEvent(new CustomEvent("centerMap"));
  };

  return (
    <>
      <nav className="navbar">
        <img
          src={questionMarkIcon}
          alt="Info"
          className="nav-icon left-icon"
          onClick={() => setInfoModalOpen(true)}
        />

        <h1 className="nav-title" onClick={handleTitleClick}>
          love at first flight
        </h1>

        <img
          src={envelopeIcon}
          alt="Messages"
          className="nav-icon right-icon"
          onClick={() => setLetterModalOpen(true)}
        />
      </nav>

      <LetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setLetterModalOpen(false)}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />
    </>
  );
};

export default OverlayUI;
