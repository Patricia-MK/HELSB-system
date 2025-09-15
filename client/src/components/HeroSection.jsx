import React from "react";
import "./HeroSection.css";
import gradImage from "../assets/images/grad.jpg";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Student Loans & Scholarships</h1>
        <p>
          Don’t miss out on your preferred career opportunity. Access our
          affordable student loans for higher education or our various
          scholarship opportunities.
        </p>
        <button>Apply Now</button>
      </div>
      <div className="hero-image">
        <img src={gradImage} alt="Graduation" />
      </div>
    </section>
  );
};

export default HeroSection;
