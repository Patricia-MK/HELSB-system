import React from "react";
import "./LoginPage.css";
import capImage from "../assets/images/cap.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg"; // make sure this file exists

export default function LoginPage() {
  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image">
        <img src={capImage} alt="Graduation cap" />
      </div>

      {/* Right Form Section */}
      <div className="login-form">
        <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
        <h2>Welcome to the HELSB ePortal! 👋</h2>
        <p>Please log in to your account to access the system.</p>

        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
