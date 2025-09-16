import React from "react";
import "./HeroSection.css";
import gradImage from "../assets/images/grad.jpg";

const HeroSection = () => {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${gradImage})` }}
    >
      <div className="hero-overlay">
        <div className="hero-text">
          <h2>Student Loans & Scholarships</h2>
          <p>
            Don’t miss out on your preferred career opportunity. Access our
            affordable student loans for higher education or our various
            scholarship opportunities.
          </p>
          <button className="apply-btn">Apply Now</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
