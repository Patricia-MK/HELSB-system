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
const officialRoutes = require("./routes/officialRoute");
const adminRoutes = require("./routes/adminRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/official", officialRoutes);
app.use("/api/admin", adminRoutes);

// DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/helsb_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
