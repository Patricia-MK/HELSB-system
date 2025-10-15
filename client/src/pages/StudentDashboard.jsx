import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";
import dashImage from "../assets/images/dash.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import StudentProfile from "./StudentProfile";
<<<<<<< Updated upstream
import Swal from "sweetalert2";
=======
import ScreenGuidelines from "./ScreenGuidelines";
>>>>>>> Stashed changes

const StudentDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fixed screening end date for all students
  const screeningEndDate = new Date("2025-11-03T23:59:59");
<<<<<<< Updated upstream

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      if (!user?.studentNumber) return;
      
      const res = await axios.get(`http://localhost:5000/api/notifications/student/${user.studentNumber}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      if (!user?.studentNumber) return;
      
      await axios.put(`http://localhost:5000/api/notifications/student/${user.studentNumber}/read-all`);
      fetchNotifications(); // Refresh notifications
      Swal.fire({
        icon: "success",
        title: "All notifications marked as read",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Fetch notifications when user data is available
  useEffect(() => {
    if (user?.studentNumber) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);
=======
>>>>>>> Stashed changes

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
    localStorage.removeItem("student");
    navigate("/login");
  };

  const refreshUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      default: return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success": return "notification-success";
      case "warning": return "notification-warning";
      case "error": return "notification-error";
      default: return "notification-info";
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
<<<<<<< Updated upstream
          <p onClick={() => setShowProfile(false)}>Home</p>
          <p onClick={() => setShowProfile(true)}>Profile</p>
          <div className="notification-menu-item" onClick={() => setShowNotifications(true)}>
            Notifications
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <p onClick={handleLogout}>Log Out</p>
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        <div className="cards-wrapper">
          <div className="header-section">
            <h1 className="welcome-message">
              Welcome {user ? user.fullName : "Student"}
            </h1>
            {user?.studentNumber && (
              <div className="student-info">
                <span>Student Number: {user.studentNumber}</span>
                {user.program && <span>Program: {user.program}</span>}
              </div>
            )}
=======
        <div className="dashboard-main">
          <div className="welcome-section">
            <h1 className="welcome-message">
              Welcome back, <span className="highlight">{user?.fullName || 'Student'}</span>!
            </h1>
            <p className="welcome-subtitle">Ready to complete your annual screening?</p>
>>>>>>> Stashed changes
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

            {/* Quick Status Card */}
            <div className="card status-card">
              <h3>Application Status</h3>
              <div className="status-content">
                {notifications.length > 0 ? (
                  <div className="latest-notification">
                    <strong>Latest Update:</strong>
                    <p>{notifications[0].message}</p>
                    <small>
                      {new Date(notifications[0].createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ) : (
                  <p>No updates yet. Check back later.</p>
                )}
              </div>
              <button 
                className="view-all-btn"
                onClick={() => setShowNotifications(true)}
              >
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="modal-overlay">
          <div className="modal-content notifications-modal">
            <div className="modal-header">
              <h3>Your Notifications</h3>
              <div className="modal-actions">
                {unreadCount > 0 && (
                  <button className="mark-all-read-btn" onClick={markAllAsRead}>
                    Mark All as Read
                  </button>
                )}
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <p className="no-notifications">No notifications yet.</p>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`notification-item ${getNotificationColor(notification.type)} ${!notification.read ? 'unread' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification._id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <small className="notification-time">
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                    {!notification.read && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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