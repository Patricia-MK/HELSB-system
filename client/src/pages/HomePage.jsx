import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FloatingButtons from "../components/FloatingButtons";
import InfoSection from "../components/InfoSection";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("studentLoans");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div>
      <Header />
      <HeroSection />
      <FloatingButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      <InfoSection activeTab={activeTab} />
      <Footer />
    </div>
  );
};

export default HomePage;
