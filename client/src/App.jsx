import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactUs from "./components/ContactUs";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import OfficialDashboard from "./pages/OfficialDashboard";
import ContactUs from "./components/ContactUs";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<OfficialDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}

export default App;
