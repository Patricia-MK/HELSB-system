import React from "react";
import capImage from "../assets/images/cap.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <img src={capImage} alt="CAP" className="cap-image" />
      </div>
      <div className="login-right">
        <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
        <h1>Welcome to the HELSB ePortal! 👋</h1>
        <p>Please log in to your account to access the system.</p>
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
