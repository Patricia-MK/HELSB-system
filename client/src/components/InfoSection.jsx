import React from "react";
import "./InfoSection.css";
import gradImage from "../assets/images/grad.jpg";

const InfoSection = ({ activeTab }) => {
  const infoData = {
    studentLoans: {
      title: "Student Loans",
      text: `Currently Student Loans are given to Undergraduate Students joining UNZA, CBU, KMU, MKU, MU, CHAU, KNU and ZUT from secondary schools across the country. The loans cater for tuition and accommodation fees and meal, book and project allowances. The students are required to repay their loans one year after leaving their institutions of learning.`,
      img: gradImage,
    },
    beneficiaries: {
      title: "Loan Beneficiaries",
      text: `HELSB Zambia provides a range of financial assistance programs, including student loans and scholarships. Our schemes are designed to alleviate the burden of educational expenses and promote academic excellence. We aim to nurture talent and empower individuals to achieve their academic goals.`,
      img: gradImage,
    },
  };

  const currentInfo = infoData[activeTab];
  if (!currentInfo) return null;

  return (
    <div className="info-section">
      <div className="info-text">
        <h2>{currentInfo.title}</h2>
        <p>{currentInfo.text}</p>
      </div>
      <div className="info-img">
        <img src={currentInfo.img} alt="" />
      </div>
    </div>
  );
};

export default InfoSection;
