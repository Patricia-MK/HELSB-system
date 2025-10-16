import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import dashImage from "../assets/images/dash.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import StudentProfile from "./StudentProfile";
import ScreenGuidelines from "./ScreenGuidelines";

const StudentDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const navigate = useNavigate();

  // Load student info from localStorage and refresh when profileRefresh event is triggered
  useEffect(() => {
    const loadUserData = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          setUser(userData);
          console.log("🔄 User data loaded:", userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    // Load initial data
    loadUserData();

    // Listen for profile refresh events (triggered after document uploads)
    const handleProfileRefresh = () => {
      console.log("🔄 Profile refresh event received");
      loadUserData();
    };

    window.addEventListener('profileRefresh', handleProfileRefresh);

    // Cleanup
    return () => {
      window.removeEventListener('profileRefresh', handleProfileRefresh);
    };
  }, []);

  // Fixed screening end date for all students
  const screeningEndDate = new Date("2025-11-03T23:59:59");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = screeningEndDate - now;

      if (timeLeft <= 0) {
        setRemainingTime("Screening period has ended");
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
  }, [screeningEndDate]);

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
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        console.log("🔄 User data refreshed manually:", userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
          <h2>HELSB Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => { setShowProfile(false); setShowGuidelines(false); }}>
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => setShowGuidelines(true)}>
            <span>Screen Guidelines</span>
          </div>
          <div className="nav-item" onClick={() => setShowProfile(true)}>
            <span>Profile</span>
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <span>Log Out</span>
          </div>
        </nav>
        
        <div className="user-welcome">
          <div className="user-avatar">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="user-info">
            <strong>{user?.fullName || 'Student'}</strong>
            <span>Year {user?.year || '1'} Student</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="background-overlay">
          <img src={dashImage} alt="Dashboard Background" className="dash-bg" />
        </div>

        <div className="dashboard-main">
          {/* Welcome Section - Clean with just text on image */}
          <div className="welcome-section">
            <h1 className="welcome-message">
              Welcome back, <span className="highlight">{user?.fullName || 'Student'}</span>! 
            </h1>
            <p className="welcome-subtitle">Ready to complete your annual screening?</p>
          </div>

          <div className="action-cards">
            {/* Screening Card */}
            <div className="action-card primary-card">
              <h3>Start Screening</h3>
              <p>Begin your student screening process and complete all required steps</p>
              <button onClick={handleStartScreening} className="card-btn primary-btn">
                Start Screening Process
              </button>
            </div>

            {/* Countdown Timer Card */}
            <div className="action-card timer-card">
              <h3>Screening Countdown</h3>
              <div className="timer-display">
                {remainingTime}
              </div>
              <p className="timer-note">
                Complete your screening before the deadline to ensure continuous loan support
              </p>
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

      {/* Guidelines Full Page Overlay */}
      {showGuidelines && (
        <ScreenGuidelines closeGuidelines={() => setShowGuidelines(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;