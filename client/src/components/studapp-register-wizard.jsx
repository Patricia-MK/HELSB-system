import React, { useState, useEffect, useRef } from "react";

// Data constants for dropdowns
const ZAMBIAN_PROVINCES = [
  "Central Province", "Copperbelt Province", "Eastern Province", 
  "Luapula Province", "Lusaka Province", "Muchinga Province", 
  "Northern Province", "North-Western Province", "Southern Province", 
  "Western Province", "Other"
];

const ZAMBIAN_DISTRICTS = {
  "Central Province": ["Chibombo", "Chisamba", "Chitambo", "Kabwe", "Kapiri Mposhi", "Luano", "Mkushi", "Mumbwa", "Ngabwe", "Serenje", "Shibuyunji"],
  "Copperbelt Province": ["Chililabombwe", "Chingola", "Kalulushi", "Kitwe", "Luanshya", "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola"],
  "Eastern Province": ["Chadiza", "Chama", "Chipata", "Kasenengwa", "Katete", "Lumezi", "Lundazi", "Mambwe", "Nyimba", "Petauke", "Sinda", "Vubwi"],
  "Luapula Province": ["Chembe", "Chiengi", "Chifunabuli", "Chipili", "Kawambwa", "Lunga", "Mansa", "Milenge", "Mwense", "Nchelenge", "Samfya"],
  "Lusaka Province": ["Chirundu", "Chongwe", "Kafue", "Luangwa", "Lusaka", "Rufunsa", "Shibuyunji"],
  "Muchinga Province": ["Chama", "Chinsali", "Isoka", "Kanchibiya", "Lavushimanda", "Mafinga", "Mpika", "Nakonde", "Shiwang'andu"],
  "Northern Province": ["Chilubi", "Chinsali", "Kaputa", "Kasama", "Lunte", "Lupososhi", "Luwingu", "Mporokoso", "Mpulungu", "Mungwi", "Nsama", "Senga"],
  "North-Western Province": ["Chavuma", "Ikelenge", "Kabompo", "Kasempa", "Manyinga", "Mufumbwe", "Mwinilunga", "Solwezi", "Zambezi"],
  "Southern Province": ["Chikankata", "Chirundu", "Choma", "Gwembe", "Itezhi-tezhi", "Kalomo", "Kazungula", "Livingstone", "Mazabuka", "Monze", "Namwala", "Pemba", "Siavonga", "Siavonga", "Sinazongwe", "Zimba"],
  "Western Province": ["Kalabo", "Kaoma", "Limulunga", "Luampa", "Lukulu", "Mitete", "Mongu", "Mulobezi", "Mwandi", "Nalolo", "Nkeyema", "Sesheke", "Shang'ombo", "Sikongo", "Sioma"],
  "Other": ["Other"]
};

const OCCUPATIONS = [
  "Teacher", "Doctor", "Nurse", "Engineer", "Lawyer", "Accountant", "Business Owner", 
  "Farmer", "Civil Servant", "Police Officer", "Soldier", "Driver", "Mechanic", 
  "Electrician", "Plumber", "Carpenter", "Retail Worker", "Banker", "Insurance Agent",
  "Real Estate Agent", "Consultant", "Manager", "Supervisor", "Technician", "Other"
];

const RELATIONS = [
  "Father", "Mother", "Guardian", "Brother", "Sister", "Uncle", "Aunt", 
  "Grandfather", "Grandmother", "Cousin", "Other"
];

const ZAMBIAN_SCHOOLS = [
  "Chilanga Secondary School", "Chisamba Secondary School", "Chitambo Secondary School",
  "Kabwe Boys Secondary School", "Kabwe Girls Secondary School", "Kapiri Mposhi Secondary School",
  "Mkushi Secondary School", "Mumbwa Secondary School", "Serenje Secondary School",
  "Chililabombwe Secondary School", "Chingola Secondary School", "Kitwe Boys Secondary School",
  "Kitwe Girls Secondary School", "Luanshya Secondary School", "Mufulira Secondary School",
  "Ndola Boys Secondary School", "Ndola Girls Secondary School", "Chadiza Secondary School",
  "Chipata Secondary School", "Katete Secondary School", "Lundazi Secondary School",
  "Petauke Secondary School", "Kawambwa Secondary School", "Mansa Secondary School",
  "Samfya Secondary School", "Chongwe Secondary School", "Kafue Secondary School",
  "Lusaka Boys Secondary School", "Lusaka Girls Secondary School", "Chinsali Secondary School",
  "Kasama Secondary School", "Mpika Secondary School", "Solwezi Secondary School",
  "Mwinilunga Secondary School", "Choma Secondary School", "Livingstone Secondary School",
  "Mazabuka Secondary School", "Monze Secondary School", "Kalabo Secondary School",
  "Mongu Secondary School", "Sesheke Secondary School", "Other"
];

// Help text component
function HelpText({ children, className = "" }) {
  return (
    <div className={`text-xs text-gray-500 mt-1 ${className}`}>
      {children}
    </div>
  );
}

// Reusable input component with validation
function ValidatedInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder, 
  required = false,
  className = "",
  rows = 1,
  helpText,
  inputRef = null,
  ...props 
}) {
  const InputComponent = type === "textarea" ? "textarea" : "input";
  
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <InputComponent
        ref={inputRef}
        type={type === "textarea" ? undefined : type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={type === "textarea" ? rows : undefined}
        className={`border rounded px-3 py-2 ${error && touched ? 'border-red-500' : 'border-gray-300'} ${className}`}
        aria-describedby={error && touched ? `${label}-error` : helpText ? `${label}-help` : undefined}
        aria-invalid={error && touched ? "true" : "false"}
        {...props}
      />
      {helpText && !error && (
        <HelpText id={`${label}-help`}>{helpText}</HelpText>
      )}
      {error && touched && (
        <span id={`${label}-error`} className="text-red-500 text-xs mt-1" role="alert">{error}</span>
      )}
    </div>
  );
}

// Reusable select component with validation
function ValidatedSelect({ 
  label, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false,
  children,
  className = "",
  ...props 
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`border rounded px-3 py-2 ${error && touched ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && touched && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}

// Searchable dropdown component
function SearchableDropdown({ 
  label, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false,
  options = [],
  placeholder = "Search...",
  className = "",
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
    onBlur();
  };

  return (
    <div className="flex flex-col relative">
      <label className="text-sm mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`border rounded px-3 py-2 w-full ${error && touched ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
      {error && touched && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}

// Drag & Drop file upload component
function DragDropFileUpload({ 
  label, 
  name, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB
  ...props 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const allowedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert(`Invalid file type. Please upload: ${accept}`);
        return;
      }
      
      // Validate file size
      if (selectedFile.size > maxSize) {
        alert(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      setFile(selectedFile);
      onChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : error && touched 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          onChange={handleFileInput}
          onBlur={onBlur}
          accept={accept}
          className="hidden"
          id={`file-${name}`}
          {...props}
        />
        <label htmlFor={`file-${name}`} className="cursor-pointer">
          <div className="text-4xl mb-2">📎</div>
          <div className="text-sm font-medium text-gray-700 mb-1">
            {file ? file.name : 'Click to upload or drag and drop'}
          </div>
          <div className="text-xs text-gray-500">
            {accept} (max {maxSize / (1024 * 1024)}MB)
          </div>
        </label>
      </div>
      {error && touched && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}

function StepHeader({ step, setStep, stepValidation }) {
  const tabs = [
    { id: 0, label: "Personal", icon: "" },
    { id: 1, label: "Education", icon: "" },
    { id: 2, label: "Guardian", icon: "" },
    { id: 3, label: "Attachments", icon: "" },
  ];
  
  return (
    <div className="mb-6">
      <div className="flex gap-3 flex-wrap mb-4">
        {tabs.map((t) => {
          const isCompleted = stepValidation[t.id];
          const isCurrent = t.id === step;
          return (
            <button
              key={t.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isCurrent 
                  ? "bg-blue-600 text-white" 
                  : isCompleted 
                    ? "bg-green-100 text-green-700 border border-green-300" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setStep(t.id)}
            >
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
              {isCompleted && <span className="text-green-600">✓</span>}
            </button>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        Step {step + 1} of 4 - {tabs[step].label} Details
      </div>
    </div>
  );
}

function StudappRegisterWizard() {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState({
    firstName: "",
    otherNames: "",
    surname: "",
    nrcNumber: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
  });
  const [education, setEducation] = useState({
    lastSchool: "",
    yearOfCompletion: "",
    schoolDistrict: "",
    examNumber: "",
  });
  const [guardian, setGuardian] = useState({
    firstName: "",
    otherNames: "",
    surname: "",
    occupation: "",
    gender: "",
    address: "",
    relation: "",
  });
  const [attachments, setAttachments] = useState({
    nrc: null,
    guardianNrc: null,
    results: null,
  });
  
  // Data integrity controls
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  // Ref for NRC input to handle cursor position
  const nrcInputRef = useRef(null);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // District options based on selected province
  const [districtOptions, setDistrictOptions] = useState([]);
  
  // Step validation tracking
  const [stepValidation, setStepValidation] = useState({ 0: false, 1: false, 2: false, 3: false });

  // Auto-save functionality
  useEffect(() => {
    const formData = { personal, education, guardian, attachments };
    localStorage.setItem('studapp-registration-draft', JSON.stringify(formData));
  }, [personal, education, guardian, attachments]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studapp-registration-draft');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.personal) setPersonal(data.personal);
        if (data.education) setEducation(data.education);
        if (data.guardian) setGuardian(data.guardian);
        if (data.attachments) setAttachments(data.attachments);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  // Update district options when province changes
  useEffect(() => {
    if (personal.province && ZAMBIAN_DISTRICTS[personal.province]) {
      setDistrictOptions(ZAMBIAN_DISTRICTS[personal.province]);
      // Reset district if it's not valid for the new province
      if (personal.district && !ZAMBIAN_DISTRICTS[personal.province].includes(personal.district)) {
        setPersonal(prev => ({ ...prev, district: "" }));
      }
    } else {
      setDistrictOptions([]);
    }
  }, [personal.province]);

  // Validation functions
  const validateNRC = (nrc) => {
    const nrcPattern = /^\d{6}\/\d{2}\/\d{1}$/;
    if (!nrc) return "NRC Number is required";
    if (!nrcPattern.test(nrc)) return "Invalid NRC format. Enter 9 digits (e.g., 274591181)";
    return "";
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{9}$/;
    if (!phone) return "Phone number is required";
    if (!phonePattern.test(phone)) return "Invalid phone number. Use 9 digits (e.g., 977123456)";
    return "";
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailPattern.test(email)) return "Invalid email format";
    return "";
  };


  const validateDateOfBirth = (dob) => {
    if (!dob) return "Date of birth is required";
    const birthDate = new Date(dob);
    const today = new Date();
    
    // Check if date is in the future
    if (birthDate > today) return "Date of birth cannot be in the future";
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) return "You must be at least 18 years old to apply";
    if (age > 100) return "Please enter a valid date of birth";
    return "";
  };

  const validateYearOfCompletion = (year) => {
    if (!year) return "Year of completion is required";
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) return "Please enter a valid year";
    if (yearNum > currentYear) return "Year cannot be in the future";
    if (yearNum < 1990) return "Year seems too old. Please verify";
    return "";
  };

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return "";
  };

  const validateSchoolName = (name) => {
    if (!name) return "School name is required";
    if (name.length < 2) return "School name must be at least 2 characters";
    if (name.length > 100) return "School name cannot exceed 100 characters";
    return "";
  };

  const validateExamNumber = (value) => {
    if (!value || value.trim().length === 0) {
      return "Examination number is required";
    }
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return "Examination number must be exactly 10 digits";
    }
    return "";
  };

  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    return "";
  };

  // Validate current step
  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 0) {
      // Personal details validation
      newErrors.firstName = validateName(personal.firstName, "First Name");
      newErrors.otherNames = personal.otherNames ? validateName(personal.otherNames, "Other Names") : "";
      newErrors.surname = validateName(personal.surname, "Surname");
      newErrors.nrcNumber = validateNRC(personal.nrcNumber);
      newErrors.dob = validateDateOfBirth(personal.dob);
      newErrors.gender = validateRequired(personal.gender, "Gender");
      newErrors.phone = validatePhone(personal.phone);
      newErrors.email = validateEmail(personal.email);
      newErrors.address = validateRequired(personal.address, "Physical Address");
      newErrors.province = validateRequired(personal.province, "Province");
      newErrors.district = validateRequired(personal.district, "District of Residence");
      newErrors.termsAccepted = !termsAccepted ? "You must accept the terms and conditions" : "";
      newErrors.privacyAccepted = !privacyAccepted ? "You must accept the privacy policy" : "";
    } else if (stepNum === 1) {
      // Education validation
      newErrors.lastSchool = validateSchoolName(education.lastSchool);
      newErrors.yearOfCompletion = validateYearOfCompletion(education.yearOfCompletion);
      newErrors.schoolDistrict = validateSchoolName(education.schoolDistrict);
      newErrors.examNumber = validateExamNumber(education.examNumber);
    } else if (stepNum === 2) {
      // Guardian validation
      newErrors.guardianFirstName = validateName(guardian.firstName, "Guardian First Name");
      newErrors.guardianOtherNames = guardian.otherNames ? validateName(guardian.otherNames, "Guardian Other Names") : "";
      newErrors.guardianSurname = validateName(guardian.surname, "Guardian Surname");
      newErrors.occupation = validateRequired(guardian.occupation, "Occupation");
      newErrors.guardianGender = validateRequired(guardian.gender, "Guardian Gender");
      newErrors.guardianAddress = validateRequired(guardian.address, "Guardian Address");
      newErrors.relation = validateRequired(guardian.relation, "Relation to Applicant");
    } else if (stepNum === 3) {
      // Attachments validation
      if (!attachments.nrc) newErrors.nrc = "Certified NRC is required";
      if (!attachments.guardianNrc) newErrors.guardianNrc = "Guardian NRC is required";
      if (!attachments.results) newErrors.results = "Statement of Results is required";
    }
    
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every(error => error === "");
    
    // Update step validation status
    setStepValidation(prev => ({ ...prev, [stepNum]: isValid }));
    
    return isValid;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(3, s + 1));
    }
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      setPersonal({
        firstName: "", otherNames: "", surname: "", nrcNumber: "", dob: "",
        gender: "", phone: "", email: "", address: "", province: "", district: ""
      });
      setEducation({
        lastSchool: "", yearOfCompletion: "", schoolDistrict: "", examNumber: ""
      });
      setGuardian({
        firstName: "", otherNames: "", surname: "", occupation: "",
        gender: "", address: "", relation: ""
      });
      setAttachments({ nrc: null, guardianNrc: null, results: null });
      setTermsAccepted(false);
      setPrivacyAccepted(false);
      setErrors({});
      setTouched({});
      setStep(0);
      localStorage.removeItem('studapp-registration-draft');
    }
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setAttachments((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  // Input formatting functions
  const formatNRC = (value, cursorPosition = null) => {
    // Remove all non-digits (including slashes)
    const digits = value.replace(/\D/g, '');
    
    // Auto-format with slashes as user types
    if (digits.length === 0) return '';
    if (digits.length <= 5) return digits;
    if (digits.length === 6) return `${digits.slice(0, 6)}/`;
    if (digits.length === 7) return `${digits.slice(0, 6)}/${digits.slice(6)}`;
    if (digits.length === 8) return `${digits.slice(0, 6)}/${digits.slice(6)}/`;
    if (digits.length === 9) return `${digits.slice(0, 6)}/${digits.slice(6, 8)}/${digits.slice(8)}`;
    // Limit to 9 digits total
    return `${digits.slice(0, 6)}/${digits.slice(6, 8)}/${digits.slice(8, 9)}`;
  };

  const formatPhone = (value) => {
    // Remove all non-digits
    return value.replace(/\D/g, '').slice(0, 9);
  };

  const formatName = (value) => {
    // Remove all non-letter characters except spaces
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  const formatSchoolName = (value) => {
    // Remove all non-letter characters except spaces, hyphens, and apostrophes
    return value.replace(/[^a-zA-Z\s\-']/g, '');
  };

  const formatExamNumber = (value) => {
    // Only allow digits and limit to 10 characters
    return value.replace(/\D/g, '').slice(0, 10);
  };

  // Special handler for NRC input to prevent jamming at slashes
  const handleNRCChange = (e) => {
    const input = e.target;
    const value = input.value;
    const cursorPosition = input.selectionStart;
    
    // Get the current cursor position relative to digits only
    const digitsBeforeCursor = value.slice(0, cursorPosition).replace(/\D/g, '').length;
    
    // Format the value
    const formattedValue = formatNRC(value);
    
    // Calculate new cursor position
    let newCursorPosition = cursorPosition;
    
    // If user is deleting and cursor is at a slash, move it to the right position
    if (value.length > formattedValue.length) {
      // User deleted something, position cursor after the last digit before the slash
      const digits = formattedValue.replace(/\D/g, '');
      if (digits.length <= 6) {
        newCursorPosition = digits.length;
      } else if (digits.length <= 8) {
        newCursorPosition = digits.length + 1; // +1 for the first slash
      } else {
        newCursorPosition = digits.length + 2; // +2 for both slashes
      }
    } else {
      // User is typing, position cursor after the formatted value
      newCursorPosition = formattedValue.length;
    }
    
    // Update the value
    setPersonal(prev => ({ ...prev, nrcNumber: formattedValue }));
    
    // Set cursor position after React updates
    setTimeout(() => {
      if (nrcInputRef.current) {
        nrcInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
    
    // Clear error when user starts typing
    if (errors.nrcNumber) {
      setErrors(prev => ({ ...prev, nrcNumber: "" }));
    }
  };

  // Handle input changes with validation
  const handlePersonalChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'nrcNumber') {
      // Use the special NRC handler instead
      return;
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (['firstName', 'otherNames', 'surname'].includes(field)) {
      formattedValue = formatName(value);
    }
    
    setPersonal(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleEducationChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'lastSchool' || field === 'schoolDistrict') {
      formattedValue = formatSchoolName(value);
    } else if (field === 'examNumber') {
      formattedValue = formatExamNumber(value);
    }
    
    setEducation(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleGuardianChange = (field, value) => {
    let formattedValue = value;
    
    // Apply name formatting for guardian name fields
    if (['firstName', 'otherNames', 'surname'].includes(field)) {
      formattedValue = formatName(value);
    }
    
    setGuardian(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    const errorKey = field === 'firstName' ? 'guardianFirstName' : 
                    field === 'surname' ? 'guardianSurname' :
                    field === 'otherNames' ? 'guardianOtherNames' :
                    field === 'gender' ? 'guardianGender' :
                    field === 'address' ? 'guardianAddress' : field;
    
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Mark field as touched
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="studapp-form-card p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Register</h2>
          <div className="text-sm opacity-90">Complete your profile and verify your details to proceed.</div>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded hover:border-red-300 transition-colors"
          title="Reset form"
        >
          Reset Form
        </button>
      </div>
      <StepHeader step={step} setStep={setStep} stepValidation={stepValidation} />

      {step === 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Personal Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="First Name"
              value={personal.firstName}
              onChange={(e) => handlePersonalChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              error={errors.firstName}
              touched={touched.firstName}
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="Other Names"
              value={personal.otherNames}
              onChange={(e) => handlePersonalChange('otherNames', e.target.value)}
              onBlur={() => handleBlur('otherNames')}
              error={errors.otherNames}
              touched={touched.otherNames}
              helpText="Letters only (no numbers or special characters)"
            />
            <ValidatedInput
              label="Surname"
              value={personal.surname}
              onChange={(e) => handlePersonalChange('surname', e.target.value)}
              onBlur={() => handleBlur('surname')}
              error={errors.surname}
              touched={touched.surname}
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="NRC Number"
              value={personal.nrcNumber}
              onChange={handleNRCChange}
              onBlur={() => handleBlur('nrcNumber')}
              error={errors.nrcNumber}
              touched={touched.nrcNumber}
              placeholder="274591/18/1"
              helpText="Enter 9 digits - slashes will be added automatically"
              required
              inputRef={nrcInputRef}
            />
            <ValidatedInput
              label="Date of Birth"
              type="date"
              value={personal.dob}
              onChange={(e) => handlePersonalChange('dob', e.target.value)}
              onBlur={() => handleBlur('dob')}
              error={errors.dob}
              touched={touched.dob}
              max={new Date().toISOString().split('T')[0]}
              helpText="Cannot be a future date"
              required
            />
            <ValidatedSelect
              label="Gender"
              value={personal.gender}
              onChange={(e) => handlePersonalChange('gender', e.target.value)}
              onBlur={() => handleBlur('gender')}
              error={errors.gender}
              touched={touched.gender}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </ValidatedSelect>
            <div className="flex flex-col">
              <label className="text-sm mb-1">
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-50">+260</span>
                <input
                  className={`border rounded-r px-3 py-2 flex-1 ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'}`}
                  value={personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="977123456"
                />
              </div>
              {!errors.phone && (
                <HelpText>Enter 9 digits without the +260 prefix (e.g., 977123456)</HelpText>
              )}
              {errors.phone && touched.phone && (
                <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
              )}
            </div>
            <ValidatedInput
              label="Email Address"
              type="email"
              value={personal.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              required
            />
            <div className="flex flex-col md:col-span-2">
              <ValidatedInput
                label="Physical Address"
                type="textarea"
                value={personal.address}
                onChange={(e) => handlePersonalChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                error={errors.address}
                touched={touched.address}
                placeholder="Enter your complete physical address..."
                rows={3}
                required
              />
            </div>
            <ValidatedSelect
              label="Province"
              value={personal.province}
              onChange={(e) => handlePersonalChange('province', e.target.value)}
              onBlur={() => handleBlur('province')}
              error={errors.province}
              touched={touched.province}
              required
            >
              <option value="">Select Province</option>
              {ZAMBIAN_PROVINCES.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </ValidatedSelect>
            <ValidatedSelect
              label="District of Residence"
              value={personal.district}
              onChange={(e) => handlePersonalChange('district', e.target.value)}
              onBlur={() => handleBlur('district')}
              error={errors.district}
              touched={touched.district}
              required
              disabled={!personal.province}
            >
              <option value="">Select District</option>
              {districtOptions.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </ValidatedSelect>
          </div>
          
          {/* Terms and Privacy */}
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.termsAccepted) {
                    setErrors(prev => ({ ...prev, termsAccepted: "" }));
                  }
                }}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and understand that providing false information may result in application rejection.
                {errors.termsAccepted && touched.termsAccepted && (
                  <span className="text-red-500 text-xs block mt-1">{errors.termsAccepted}</span>
                )}
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (errors.privacyAccepted) {
                    setErrors(prev => ({ ...prev, privacyAccepted: "" }));
                  }
                }}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I consent to the processing of my personal data as described in the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> for loan application purposes.
                {errors.privacyAccepted && touched.privacyAccepted && (
                  <span className="text-red-500 text-xs block mt-1">{errors.privacyAccepted}</span>
                )}
              </label>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button className="studapp-btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Education Background</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Last School Attended"
              value={education.lastSchool}
              onChange={(e) => handleEducationChange('lastSchool', e.target.value)}
              onBlur={() => handleBlur('lastSchool')}
              error={errors.lastSchool}
              touched={touched.lastSchool}
              placeholder="Enter your school name"
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="Year of Completion"
              type="number"
              value={education.yearOfCompletion}
              onChange={(e) => handleEducationChange('yearOfCompletion', e.target.value)}
              onBlur={() => handleBlur('yearOfCompletion')}
              error={errors.yearOfCompletion}
              touched={touched.yearOfCompletion}
              placeholder="2023"
              min="1990"
              max={new Date().getFullYear()}
              required
            />
            <ValidatedInput
              label="School District"
              value={education.schoolDistrict}
              onChange={(e) => handleEducationChange('schoolDistrict', e.target.value)}
              onBlur={() => handleBlur('schoolDistrict')}
              error={errors.schoolDistrict}
              touched={touched.schoolDistrict}
              placeholder="Enter school district"
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="Examination Number"
              value={education.examNumber}
              onChange={(e) => handleEducationChange('examNumber', e.target.value)}
              onBlur={() => handleBlur('examNumber')}
              error={errors.examNumber}
              touched={touched.examNumber}
              placeholder="Enter 10-digit examination number"
              helpText="Must be exactly 10 digits (numbers only)"
              required
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button className="px-3 py-2 rounded" onClick={prev}>Back</button>
            <button className="studapp-btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Guardian Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Guardian First Name"
              value={guardian.firstName}
              onChange={(e) => handleGuardianChange('firstName', e.target.value)}
              onBlur={() => handleBlur('guardianFirstName')}
              error={errors.guardianFirstName}
              touched={touched.guardianFirstName}
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="Guardian Other Names"
              value={guardian.otherNames}
              onChange={(e) => handleGuardianChange('otherNames', e.target.value)}
              onBlur={() => handleBlur('guardianOtherNames')}
              error={errors.guardianOtherNames}
              touched={touched.guardianOtherNames}
              helpText="Letters only (no numbers or special characters)"
            />
            <ValidatedInput
              label="Guardian Surname"
              value={guardian.surname}
              onChange={(e) => handleGuardianChange('surname', e.target.value)}
              onBlur={() => handleBlur('guardianSurname')}
              error={errors.guardianSurname}
              touched={touched.guardianSurname}
              helpText="Letters only (no numbers or special characters)"
              required
            />
            <ValidatedInput
              label="Occupation"
              value={guardian.occupation}
              onChange={(e) => handleGuardianChange('occupation', e.target.value)}
              onBlur={() => handleBlur('occupation')}
              error={errors.occupation}
              touched={touched.occupation}
              placeholder="Enter occupation"
              helpText="Enter the guardian's occupation or job title"
              required
            />
            <ValidatedSelect
              label="Gender"
              value={guardian.gender}
              onChange={(e) => handleGuardianChange('gender', e.target.value)}
              onBlur={() => handleBlur('guardianGender')}
              error={errors.guardianGender}
              touched={touched.guardianGender}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </ValidatedSelect>
            <div className="flex flex-col md:col-span-2">
              <ValidatedInput
                label="Physical Address"
                type="textarea"
                value={guardian.address}
                onChange={(e) => handleGuardianChange('address', e.target.value)}
                onBlur={() => handleBlur('guardianAddress')}
                error={errors.guardianAddress}
                touched={touched.guardianAddress}
                placeholder="Enter guardian's complete physical address..."
                rows={3}
                required
              />
            </div>
            <ValidatedSelect
              label="Relation to Applicant"
              value={guardian.relation}
              onChange={(e) => handleGuardianChange('relation', e.target.value)}
              onBlur={() => handleBlur('relation')}
              error={errors.relation}
              touched={touched.relation}
              required
            >
              <option value="">Select Relation</option>
              {RELATIONS.map(relation => (
                <option key={relation} value={relation}>{relation}</option>
              ))}
            </ValidatedSelect>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button className="px-3 py-2 rounded" onClick={prev}>Back</button>
            <button className="studapp-btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Attachments</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DragDropFileUpload
              label="Certified NRC"
              name="nrc"
              onChange={(file) => setAttachments(prev => ({ ...prev, nrc: file }))}
              onBlur={() => handleBlur('nrc')}
              error={errors.nrc}
              touched={touched.nrc}
              required
            />
            <DragDropFileUpload
              label="Guardian NRC"
              name="guardianNrc"
              onChange={(file) => setAttachments(prev => ({ ...prev, guardianNrc: file }))}
              onBlur={() => handleBlur('guardianNrc')}
              error={errors.guardianNrc}
              touched={touched.guardianNrc}
              required
            />
            <DragDropFileUpload
              label="Statement of Results"
              name="results"
              onChange={(file) => setAttachments(prev => ({ ...prev, results: file }))}
              onBlur={() => handleBlur('results')}
              error={errors.results}
              touched={touched.results}
              required
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button className="px-3 py-2 rounded" onClick={prev}>Back</button>
            <button 
              className="studapp-btn-primary" 
              onClick={() => {
                if (validateStep(3)) {
                  alert("Registration submitted successfully! (Demo)");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudappRegisterWizard;


