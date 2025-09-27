import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function StudappApplyLoan({ studentId }) {
  const [step, setStep] = useState(0);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [universities, setUniversities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedSchoolDuration, setSelectedSchoolDuration] = useState(0);
  const [form, setForm] = useState({
    studentNumber: "",
    school: "", // Now stores school ID
    program: "", // Now stores program ID
    yearOfStudy: "",
    sponsorshipRate: "",
    acceptanceLetter: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const next = () => setStep((s) => Math.min(1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, acceptanceLetter: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder: integrate with backend upload and application APIs later
      const selectedUni = universities.find(u => u._id === selectedUniversityId);
      alert("Application submitted (demo). University: " + (selectedUni?.name || "Unknown"));
    } catch (err) {
      setError("Failed to submit application");
    }
  };

  // Fetch universities on mount
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/studapp/academics/universities");
        setUniversities(data);
      } catch (err) {
        setError("Failed to fetch universities.");
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch schools when university changes
  useEffect(() => {
    if (selectedUniversityId) {
      const fetchSchools = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/studapp/academics/schools?universityId=${selectedUniversityId}`);
          setSchools(data);
          setForm(prev => ({ ...prev, school: "", program: "", yearOfStudy: "" })); // Reset dependent fields
          setSelectedSchoolDuration(0);
        } catch (err) {
          setError("Failed to fetch schools.");
        } finally {
          setLoading(false);
        }
      };
      fetchSchools();
    } else {
      setSchools([]);
      setForm(prev => ({ ...prev, school: "", program: "", yearOfStudy: "" }));
      setSelectedSchoolDuration(0);
    }
  }, [selectedUniversityId]);

  // Fetch programs when school changes
  useEffect(() => {
    if (form.school) {
      const fetchPrograms = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/studapp/academics/programs?schoolId=${form.school}`);
          setPrograms(data);
          const school = schools.find(s => s._id === form.school);
          setSelectedSchoolDuration(school ? school.duration : 0);
          setForm(prev => ({ ...prev, program: "", yearOfStudy: "" })); // Reset dependent fields
        } catch (err) {
          setError("Failed to fetch programs.");
        } finally {
          setLoading(false);
        }
      };
      fetchPrograms();
    } else {
      setPrograms([]);
      setSelectedSchoolDuration(0);
      setForm(prev => ({ ...prev, program: "", yearOfStudy: "" }));
    }
  }, [form.school, schools]);

  const handleUniversitySelect = (uniId) => {
    setSelectedUniversityId(uniId);
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setForm(prev => ({ ...prev, school: schoolId }));
  };

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setForm(prev => ({ ...prev, program: programId }));
  };

  // Generate year options based on selected school's duration
  const yearOptions = useMemo(() => {
    if (selectedSchoolDuration <= 0) return [];
    return Array.from({ length: selectedSchoolDuration }, (_, i) => i + 1);
  }, [selectedSchoolDuration]);

  return (
    <div className="studapp-form-card p-5">
      <h2>Apply for Student Loan</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading && <div className="text-blue-600 text-sm mb-2">Loading...</div>}

      {step === 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Select University</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((u) => {
              const selected = selectedUniversityId === u._id;
              return (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => handleUniversitySelect(u._id)}
                  className={"studapp-uni-card " + (selected ? "selected" : "")}
                  style={{ backgroundImage: `url(${getUniversityBg(u.name)})` }}
                >
                  <span className="studapp-uni-card-title">{u.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end pt-2">
            <button
              className={selectedUniversityId ? "studapp-btn-success" : "studapp-btn-primary"}
              onClick={next}
              disabled={!selectedUniversityId}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm font-semibold">Study Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Student Number</label>
              <input name="studentNumber" value={form.studentNumber} onChange={handleChange} className="studapp-input" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">School</label>
              <select
                name="school"
                value={form.school}
                onChange={handleSchoolChange}
                className="studapp-input"
                disabled={!selectedUniversityId}
              >
                <option value="">Select school</option>
                {schools.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Program</label>
              <select
                name="program"
                value={form.program}
                onChange={handleProgramChange}
                className="studapp-input"
                disabled={!form.school}
              >
                <option value="">Select program</option>
                {programs.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Year of Study</label>
              <select name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} className="studapp-input">
                <option value="">Select year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={String(y)}>{`${y} year`}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Rate of Sponsorship</label>
              <select name="sponsorshipRate" value={form.sponsorshipRate} onChange={handleChange} className="studapp-input">
                <option value="">Select rate</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Acceptance Letter</label>
              <input type="file" onChange={handleFile} className="studapp-input" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" className="px-3 py-2 rounded" onClick={back}>Back</button>
            <button type="submit" className="studapp-btn-primary">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudappApplyLoan;

// Helpers
function getUniversityBg(name) {
  // Map known names to existing assets; fallback to grad.jpg
  try {
    switch (name) {
      case "Chalimbana University":
        return require("../assets/images/chalimbana.png");
      case "Copperbelt University":
        return require("../assets/images/cbu.png");
      case "Kapasa Makasa University":
        return require("../assets/images/kapasa-makasa.jpeg");
      case "Kwame Nkrumah University":
        return require("../assets/images/kwame.png");
      case "Mulungushi University":
        return require("../assets/images/mulungushi.jpeg");
      case "Mukuba University":
        return require("../assets/images/mukuba.png");
      case "Palabana University":
        return require("../assets/images/palabana.jpeg");
      case "University of Zambia":
        return require("../assets/images/unza.png");
      case "Zambia University College of Technology":
        return require("../assets/images/ZUT.png");
      default:
        return require("../assets/images/grad.jpg");
    }
  } catch (_) {
    return "";
  }
}


