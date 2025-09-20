const bcrypt = require("bcryptjs");

// Pre-seeded student accounts
const students = [
  {
    email: "chaabilolubobya@gmail.com",
    // hashed password for student number "2021418235"
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
];

// Example HELSB official
const officials = [
  {
    email: "official@helsb.gov.zm",
    password: bcrypt.hashSync("admin123", 10),
    role: "official",
  },
];

module.exports = { students, officials };
