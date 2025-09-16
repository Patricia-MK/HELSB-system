import React from "react";
import "./Header.css";
import helsbLogo from "../assets/images/helsb.jpg"; // HELSB logo

const Header = ({ onContactClick }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src={helsbLogo} alt="HELSB Logo" />
        <h1>HELSB</h1>
      </div>
      <nav>
        <ul>
          <li>
            <button className="nav-btn">Student Loans</button>
          </li>
          <li>
            <button className="nav-btn" onClick={onContactClick}>
              Contact Us
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
