import React, { useEffect } from "react";
import "./SuccessAnimation.css";

const SuccessAnimation = ({ show, message, subMessage, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000); // Increased to 5 seconds to allow reading both messages
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="success-overlay">
      <div className="success-container">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        <h3 className="success-title">{message || "Success!"}</h3>
        <p className="success-message">{subMessage || "Your action was completed successfully."}</p>
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti-piece"></div>
          ))}
        </div>
        <button className="success-close-btn" onClick={onClose}>
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessAnimation;