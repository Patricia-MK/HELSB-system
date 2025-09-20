// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactUs from "./components/ContactUs";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
