import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import helsbLogo from "../assets/images/helsblogo.jpg";
import gradImage from "../assets/images/grad.jpg";
import "./StudentApplicationPage.css";

const StudentApplicationPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleStartApplication = () => {
    navigate("/student-application-form");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="student-application-page">
      {/* Navigation Bar */}
      <nav className="application-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo" onClick={handleHomeClick}>
            <img src={helsbLogo} alt="HELSB Logo" className="logo-img" />
            <span className="logo-text">HELSB</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            <button className="nav-link" onClick={handleHomeClick}>
              Home
            </button>
            <button className="nav-link" onClick={handleContactClick}>
              Contact
            </button>
            <button className="nav-link apply-btn-nav">
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <button className="mobile-nav-link" onClick={handleHomeClick}>
            Home
          </button>
          <button className="mobile-nav-link" onClick={handleContactClick}>
            Contact
          </button>
          <button className="mobile-nav-link apply-btn-mobile">
            Apply Now
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Welcome to the Student Loan Application Website!
            </h1>
            <p className="welcome-message">
              We're excited to help you take the next step in your educational journey. 
              Applying for your student loan is simple—just fill out the online form, 
              upload your documents, and submit your application. Start your journey 
              toward achieving your academic goals today!
            </p>
            <div className="welcome-actions">
              <button className="start-application-btn" onClick={handleStartApplication}>
                Start Application
              </button>
            </div>
          </div>
          <div className="welcome-image">
            <img src={gradImage} alt="Student graduation" className="hero-image" />
          </div>
        </div>
      </section>


      {/* Application Steps Preview */}
      <section className="steps-section">
        <div className="steps-container">
          <h2>How to Apply</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Fill Application Form</h3>
                <p>Complete your personal, academic, and financial information</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Upload Documents</h3>
                <p>Submit required documents like NRC, academic transcripts, and bank statements</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Submit & Review</h3>
                <p>Submit your application and track its progress through our system</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get Approved</h3>
                <p>Receive approval notification and loan disbursement details</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start Your Application?</h2>
          <p>Join thousands of students who have successfully secured their education funding through HELSB.</p>
          <button className="cta-button" onClick={handleStartApplication}>
            Begin Your Application Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="application-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>HELSB</h3>
              <p>Empowering students to achieve their educational dreams through accessible financial support.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><button onClick={handleHomeClick}>Home</button></li>
                <li><button onClick={handleContactClick}>Contact</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><button>Help Center</button></li>
                <li><button>FAQ</button></li>
                <li><button>Contact Support</button></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HELSB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentApplicationPage;
