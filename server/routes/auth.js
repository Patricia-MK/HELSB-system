const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hardcoded student accounts with hashed passwords
const users = [
  {
    email: "chaabilolubobya@gmail.com",
    password: bcrypt.hashSync("2021418235", 10),
    role: "student",
  },
  {
    email: "patriciambomakashweka@gmail.com",
    password: bcrypt.hashSync("2021527433", 10),
    role: "student",
  },
  {
    email: "lucksonphiri@gmail.com",
    password: bcrypt.hashSync("2021465560", 10),
    role: "student",
  },
  {
    email: "official@helsb.gov.zm",
    password: bcrypt.hashSync("official123", 10),
    role: "official",
  },
];

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, role: user.role });
});

module.exports = router;
