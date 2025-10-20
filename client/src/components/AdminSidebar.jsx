// src/components/AdminSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: "📊", description: "Overview & Analytics" },
    { id: "All Applications", label: "Applications", icon: "📋", description: "Manage student applications" },
    { id: "User Management", label: "User Management", icon: "👥", description: "Manage officials" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h2>HELSB Admin</h2>
        <p>Administration Panel</p>
      </div>
      
      {/* Navigation */}
      <div className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item-wrapper">
            <button
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-content">
                <div className="nav-label">{item.label}</div>
                <div className="nav-description">{item.description}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <div className="logout-icon">🚪</div>
          <div className="logout-content">
            <div className="logout-label">Log Out</div>
            <div className="logout-description">Sign out of admin panel</div>
          </div>
        </button>

        {/* Footer */}
        <div className="sidebar-copyright">
          HELSB System
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;