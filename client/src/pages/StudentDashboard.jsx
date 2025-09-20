import React, { useState } from "react";
import "./StudentDashboard.css";
import dashImage from "../assets/images/dash.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import StudentProfile from "./StudentProfile";

const StudentDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);

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
          <p>Screening</p>
          <p>Log Out</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="background-overlay">
          <img src={dashImage} alt="Dashboard Background" className="dash-bg" />
        </div>

        <div className="content-cards">
          <div className="card">
            <h3>Start Screening</h3>
            <p>Begin your student screening process here.</p>
            <button>Start Now</button>
          </div>

          <div className="card">
            <h3>Available Scholarships</h3>
            <p>Check current scholarships on the HELSB official site.</p>
            <a
              href="https://helsb.gov.zm/scholarships/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>View Scholarships</button>
            </a>
          </div>
        </div>
      </main>

      {/* Profile Modal Overlay */}
      {showProfile && <StudentProfile closeProfile={() => setShowProfile(false)} />}
    </div>
  );
};

export default StudentDashboard;
