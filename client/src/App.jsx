import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactUs from "./components/ContactUs";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import OfficialDashboard from "./pages/OfficialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AgreementForm from "./pages/AgreementForm";
import UploadFirstTimer from "./pages/UploadFirstTimer";
import UploadReturning from "./pages/UploadReturning";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/official-dashboard" element={<OfficialDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/agreement-form" element={<AgreementForm />} />
      <Route path="/upload-first-timer" element={<UploadFirstTimer />} />
      <Route path="/upload-returning" element={<UploadReturning />} />

    </Routes>
  );
}

export default App;
