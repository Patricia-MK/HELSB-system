import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import './HomePage.css';
import FloatingButton from '../components/FloatingButton';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <Hero />
      <div className="floating-buttons">
        <FloatingButton title="Student Loans" description="Apply for a student loan" />
        <FloatingButton title="Beneficiaries" description="View beneficiaries" />
        <FloatingButton title="Screening" description="Start screening (login required)" />
      </div>
    </div>
  );
};

export default HomePage;
