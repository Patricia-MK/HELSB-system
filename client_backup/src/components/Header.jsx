import React from 'react';
import './Header.css';
import helsbLogo from '../assets/images/helsb.jpg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={helsbLogo} alt="HELSB Logo" />
      </div>
      <nav>
        <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
