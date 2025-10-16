// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/auth");
const agreementRoutes = require("./routes/agreementRoutes");
const uploadRoutes = require("./routes/upload");
const applicationRoutes = require("./routes/applicationRoutes");
const officialRoutes = require("./routes/officialRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentProfileRoutes = require("./routes/studentProfile");
const notificationRoutes = require("./routes/notifications");
// studapp routes
const studappRegistrationRoutes = require("./routes/studapp-registration");
const studappApplicationRoutes = require("./routes/studapp-application");
const studappUploadGridRoutes = require("./routes/studapp-upload-grid");
const studappAcademicsRoutes = require("./routes/studapp-academics");

// loan application routes
const loanApplicationRoutes = require("./routes/loanApplicationRoutes");

const app = express();

// Middleware - UPDATED CORS for file access
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
//  CSP MIDDLEWARE 
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http://localhost:3000; " +
    "connect-src 'self' http://localhost:5000 http://localhost:3000; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: http://localhost:5000 blob:;"
  );
  next();
});

app.use(express.json());

// Static folder for uploaded files - MAKE SURE THIS IS CORRECT
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    // Set proper headers for PDF files and images
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    // Allow cross-origin access to files
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/official/agreements", officialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentProfileRoutes);
app.use("/api/notifications", notificationRoutes);

// studapp
app.use("/api/studapp/registration", studappRegistrationRoutes);
app.use("/api/studapp/applications", studappApplicationRoutes);
app.use("/api/studapp/upload-grid", studappUploadGridRoutes);
app.use("/api/studapp/academics", studappAcademicsRoutes);
// loan applications
app.use("/api/loan-applications", loanApplicationRoutes);

// DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/helsb_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));