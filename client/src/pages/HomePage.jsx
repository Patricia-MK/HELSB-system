import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FloatingButtons from "../components/FloatingButtons";
import InfoSection from "../components/InfoSection";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("studentLoans");
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleContactClick = () => {
    setShowContact(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div>
      <Header onContactClick={handleContactClick} />
      <HeroSection />
      <FloatingButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <InfoSection activeTab={activeTab} />
      {showContact && <ContactUs />}
      <Footer />
    </div>
  );
};

export default HomePage;
