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
import StudappDashboard from "./pages/studapp-dashboard";
// Loan Application Components
import LoanDashboard from "./pages/LoanDashboard";
import LoanApplicationForm from "./pages/LoanApplicationForm";
// Student Application Components
import StudentApplicationPage from "./pages/StudentApplicationPage";
import StudentApplicationForm from "./pages/StudentApplicationForm";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/studapp-dashboard" element={<StudappDashboard />} />
      <Route path="/official-dashboard" element={<OfficialDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/agreement-form" element={<AgreementForm />} />
      <Route path="/upload-first-timer" element={<UploadFirstTimer />} />
      <Route path="/upload-returning" element={<UploadReturning />} />

      {/* Loan Application Routes */}
      <Route path="/loan-dashboard" element={<LoanDashboard />} />
      <Route path="/loan-application-form" element={<LoanApplicationForm />} />
      {/* Student Application Routes */}
      <Route path="/student-application" element={<StudentApplicationPage />} />
      <Route path="/student-application-form" element={<StudentApplicationForm />} />
     

    </Routes>
  );
}

export default App;
