import React, { useState } from "react";
import axios from "axios";

function StudappApplicationForm({ studentId, onSubmitted }) {
  const [program, setProgram] = useState("");
  const [loanNumber, setLoanNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!program) {
      setError("Program is required");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.post(
        "/api/applications",
        { studentId, program, loanNumber: loanNumber || undefined },
        { headers }
      );
      if (onSubmitted) onSubmitted(data.application || data);
      setProgram("");
      setLoanNumber("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Program</label>
        <input
          type="text"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="e.g. Computer Science"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Loan Number (optional)</label>
        <input
          type="text"
          value={loanNumber}
          onChange={(e) => setLoanNumber(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Existing loan number if any"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

export default StudappApplicationForm;


