// src/components/OfficialSidebar.jsx
import React from "react";
import "./OfficialSidebar.css";
import helsbLogo from "../assets/images/helsblogo.jpg"; // Adjust path as needed

const OfficialSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "My Assignments", label: "Screened Students", icon: "📋" },
    { id: "All Applications", label: "All Students", icon: "👥" },
    // Removed "My Performance" item
  ];

  return (
    <div className="official-sidebar">
      {/* Logo Section - Matching Student Dashboard */}
      <div className="logo-section">
        <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
        <div className="logo-text">
          <h2>HELSB Portal</h2>
          <p>Official Dashboard</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Official Badge */}
      <div className="official-badge">
        <div className="badge-title">HELSB Official</div>
        <div className="badge-subtitle">Screening & Verification</div>
      </div>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default OfficialSidebar;