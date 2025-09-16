import React from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingButtons.css"; // make sure you have this CSS

const FloatingButtons = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="floating-buttons">
      <button
        className={activeTab === "studentLoans" ? "active" : ""}
        onClick={() => setActiveTab("studentLoans")}
      >
        Student Loans
      </button>
      <button
        className={activeTab === "beneficiaries" ? "active" : ""}
        onClick={() => setActiveTab("beneficiaries")}
      >
        Beneficiaries
      </button>
      <button onClick={() => navigate("/login")}>Screening</button>
    </div>
  );
};

export default FloatingButtons;
