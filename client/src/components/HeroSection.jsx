import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";
import gradImage from "../assets/images/grad.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    // Direct users to the student application page
    navigate("/student-application");
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${gradImage})` }}
    >
      <div className="hero-overlay">
        <div className="hero-text">
          <h2>Student Loans & Scholarships</h2>
          <p>
            Don't miss out on your preferred career opportunity. Access our
            affordable student loans for higher education or our various
            scholarship opportunities.
          </p>
          <button className="apply-btn" onClick={handleApplyNow}>
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
