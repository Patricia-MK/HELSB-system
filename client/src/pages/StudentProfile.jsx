import React, { useState, useEffect } from "react";
import "./StudentProfile.css";

const StudentProfile = ({ closeProfile, onCloseRefresh }) => {
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loanInfo, setLoanInfo] = useState({
    total: 0,
    remaining: 0,
    details: {},
  });

  // Load student info from backend using email from localStorage
  useEffect(() => {
    const fetchStudentInfo = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("student") || localStorage.getItem("user");
        if (!storedUser) return;

        const { email } = JSON.parse(storedUser);
        if (!email) return;

        const res = await fetch(`http://localhost:5000/api/users/email/${email}`);
        if (!res.ok) throw new Error("Failed to fetch student info");
        const data = await res.json();

        const s = {
          fullName: data.fullName || "",
          studentID: data.studentID || data.studentId || "",
          loanNumber: data.loanNumber || "",
          year: data.year || 1,
          nrcNo: data.nrcNo || "",
          school: data.school || "",
          institution: data.institution || "University of Zambia",
          program: data.program || "",
          qualification: data.qualification || "",
          _id: data._id || data.studentId || null,
        };
        setStudent(s);
      } catch (err) {
        console.error("Error loading student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, []);

  // Fetch uploaded documents for this student
  const fetchDocuments = async () => {
    if (!student?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/upload/${student._id}`);
      if (!res.ok) {
        setDocuments([]);
        return;
      }
      const data = await res.json();
      if (data && typeof data === "object") {
        const docsArray = Object.entries(data).map(([name, url]) => ({
          name,
          url: url.startsWith("http") ? url : `http://localhost:5000${url}`,
        }));
        setDocuments(docsArray);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  // Fetch documents whenever student changes
  useEffect(() => {
    fetchDocuments();
  }, [student]);

  // Refresh documents if student uploads new ones
  useEffect(() => {
    const refresh = () => fetchDocuments();
    window.addEventListener("profileRefresh", refresh);
    return () => window.removeEventListener("profileRefresh", refresh);
  }, [student]);

  // Loan calculation (fixed rules)
  const calculateLoan = () => {
    if (!student) return;

    let tuition = 25808; // default
    const school = (student.school || "").toLowerCase();
    if (
      school.includes("engineering") ||
      school.includes("natural") ||
      school.includes("science") ||
      school.includes("medicine") ||
      school.includes("health")
    ) tuition = 31878;

    const accommodation = 3900;
    const mealPerMonth = 750;

    const screeningDate = new Date(localStorage.getItem("screeningDate") || new Date());
    const today = new Date();
    const monthsSinceScreening = Math.max(
      0,
      (today.getFullYear() - screeningDate.getFullYear()) * 12 +
        (today.getMonth() - screeningDate.getMonth())
    );
    const mealTotal = Math.min(monthsSinceScreening, 12) * mealPerMonth;

    const totalLoan = tuition + accommodation + mealTotal;
    const details = {
      tuition,
      accommodation,
      mealAllowance: mealTotal,
      monthsCovered: Math.min(monthsSinceScreening, 12),
    };

    setLoanInfo({ total: totalLoan, remaining: totalLoan, details });
  };

  useEffect(() => {
    calculateLoan();
  }, [student]);

  const handleClose = () => {
    if (onCloseRefresh) onCloseRefresh();
    closeProfile();
  };

  const statusColor = "#f0ad4e";

  return (
    <div className="profile-overlay" role="dialog" aria-modal="true">
      <div className="profile-container" aria-live="polite">
        <button className="close-btn" onClick={handleClose} aria-label="Close profile">
          X
        </button>

        <div className="profile-header">
          <h2>Student Profile</h2>
          <div className="status-wrapper">
            <span className="status-label">Status:</span>
            <span className="status-badge" style={{ backgroundColor: statusColor }}>
              Pending
            </span>
          </div>
        </div>

        <div className="tabs">
          <input type="radio" name="tab" id="detailsTab" defaultChecked />
          <label htmlFor="detailsTab">Details</label>

          <input type="radio" name="tab" id="documentsTab" />
          <label htmlFor="documentsTab">Documents</label>

          <input type="radio" name="tab" id="loanTab" />
          <label htmlFor="loanTab">Loan</label>

          {/* Details Tab */}
          <div className="tab-content details-content">
            {loading || !student ? (
              <p>Loading profile...</p>
            ) : (
              <>
                <p><strong>Full Name:</strong> {student.fullName}</p>
                <p><strong>Email:</strong> {JSON.parse(localStorage.getItem("student") || localStorage.getItem("user"))?.email || "N/A"}</p>
                <p><strong>University:</strong> {student.institution}</p>
                <p><strong>Program:</strong> {student.program}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <p><strong>Student Number:</strong> {student.studentID}</p>
                <p><strong>NRC:</strong> {student.nrcNo}</p>
                <p><strong>Loan Number:</strong> {student.loanNumber}</p>
                <p><strong>Qualification:</strong> {student.qualification}</p>
                <p><strong>School:</strong> {student.school}</p>
              </>
            )}
          </div>

          {/* Documents Tab */}
          <div className="tab-content documents-content">
            {loading ? (
              <p>Loading documents...</p>
            ) : documents.length === 0 ? (
              <p>No documents uploaded yet.</p>
            ) : (
              documents.map((doc, idx) => (
                <div key={idx} className="document-item">
                  <span style={{ textTransform: "capitalize" }}>
                    {doc.name.replace(/([A-Z])/g, " $1")}
                  </span>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Loan Tab */}
          <div className="tab-content loan-content">
            <p><strong>Tuition Fee:</strong> K{loanInfo.details.tuition?.toLocaleString()}</p>
            <p><strong>Accommodation:</strong> K{loanInfo.details.accommodation?.toLocaleString()}</p>
            <p>
              <strong>Meal Allowance:</strong> K{loanInfo.details.mealAllowance?.toLocaleString()} (
              {loanInfo.details.monthsCovered} months)
            </p>
            <hr />
            <p><strong>Total Loan for the Year:</strong> K{loanInfo.total.toLocaleString()}</p>
            <p><strong>Remaining Balance:</strong> K{loanInfo.remaining.toLocaleString()}</p>
            <div className="loan-bar-container" aria-hidden>
              <div
                className="loan-bar"
                style={{
                  width: `${Math.min((loanInfo.remaining / loanInfo.total) * 100, 100)}%`,
                  background: "#28a745",
                }}
              ></div>
            </div>
            <p>Loan repayment progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
