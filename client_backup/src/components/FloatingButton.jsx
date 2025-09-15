import React from 'react';
import './FloatingButton.css';

const FloatingButton = ({ title, description }) => {
  return (
    <div className="floating-button">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FloatingButton;
