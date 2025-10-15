import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import dashImage from "../assets/images/dash.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import StudentProfile from "./StudentProfile";

const StudentDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fixed screening end date for all students
  const screeningEndDate = new Date("2025-11-03T23:59:59"); // 3 weeks from now

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = screeningEndDate - now;

      if (timeLeft <= 0) {
        setRemainingTime("Screening period has ended. You can no longer screen.");
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartScreening = () => {
    const now = new Date();
    if (now > screeningEndDate) {
      alert("The screening period has ended. You can no longer screen.");
      return;
    }
    navigate("/agreement-form");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const refreshUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  };

  const handleLoanApplication = () => {
    navigate("/loan-dashboard"); // navigates to Loan Dashboard
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
          <h2>HELSB</h2>
        </div>
        <nav className="sidebar-nav">
          <p onClick={() => setShowProfile(false)}>Home</p>
          <p onClick={() => setShowProfile(true)}>Profile</p>
          <p onClick={handleLogout}>Log Out</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="background-overlay">
          <img src={dashImage} alt="Dashboard Background" className="dash-bg" />
        </div>

        <div className="cards-wrapper">
          <h1 className="welcome-message">
            Welcome {user ? user.fullName : "Student"}
          </h1>

          <div className="content-cards">
            {/* Screening Card */}
            <div className="card">
              <h3>Start Screening</h3>
              <p>Begin your student screening process here.</p>
              <button onClick={handleStartScreening}>Start Now</button>
            </div>


            {/* Countdown Timer Card */}
            <div className="card timer-card">
              <h3>Screening Countdown</h3>
              <p className="timer-numbers">{remainingTime}</p>
              <small>
                You have three weeks to complete your screening. After this
                period, submissions will be closed.
              </small>

            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal Overlay */}
      {showProfile && (
        <StudentProfile
          closeProfile={() => setShowProfile(false)}
          onCloseRefresh={refreshUser}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
