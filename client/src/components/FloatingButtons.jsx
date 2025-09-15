import React from "react";
import "./FloatingButtons.css";

const FloatingButtons = ({ activeTab, setActiveTab }) => {
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
      <button
        className={activeTab === "screening" ? "active" : ""}
        onClick={() => setActiveTab("screening")}
      >
        Screening
      </button>
    </div>
  );
};

export default FloatingButtons;
