const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const MONGO_URI = "mongodb://127.0.0.1:27017/helsb_db";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const seedUsers = async () => {
  await User.deleteMany(); // clear old data

  const users = [
    // Students
    { fullName: "Dalitso Phiri", email: "dalitsophiri@gmail.com", password: "2021512258", role: "student", year: 4, studentID: "2021512258", loanNumber: "2110745461" },
    { fullName: "Chaabilo Lubobya", email: "chaabilolubobya@gmail.com", password: "2021418235", role: "student", year: 4, studentID: "2021418235", loanNumber: "2110745466" },
    { fullName: "Patricia Mboma Kashweka", email: "patriciakambomakashweka@gmail.com", password: "2021527433", role: "student", year: 3, studentID: "2021527433", loanNumber: "2110745463" },
    { fullName: "John Banda", email: "johnbanda@gmail.com", password: "2024100001", role: "student", year: 1, studentID: "2024100001", loanNumber: "2110745470" },
    { fullName: "Mary Zulu", email: "maryzulu@gmail.com", password: "2024100002", role: "student", year: 1, studentID: "2024100002", loanNumber: "2110745471" },
    { fullName: "Peter Mwansa", email: "petermwansa@gmail.com", password: "2023100001", role: "student", year: 3, studentID: "2023100001", loanNumber: "2110745472" },
    { fullName: "Alice Phiri", email: "alicephiri@gmail.com", password: "2024100003", role: "student", year: 1, studentID: "2024100003", loanNumber: "2110745473" },
    { fullName: "James Chanda", email: "jameschanda@gmail.com", password: "2022200001", role: "student", year: 2, studentID: "2022200001", loanNumber: "2110745474" },
    { fullName: "Linda Simukoko", email: "lindasimukoko@gmail.com", password: "2022100001", role: "student", year: 2, studentID: "2022100001", loanNumber: "2110745475" },
    { fullName: "Robert Tembo", email: "roberttembo@gmail.com", password: "2023100002", role: "student", year: 3, studentID: "2023100002", loanNumber: "2110745476" },

    // Supervisor
    { fullName: "Alice Supervisor", email: "alice.supervisor@gmail.com", password: "supervisor123", role: "supervisor" },

    // Official
    { fullName: "Bob Official", email: "bob.official@gmail.com", password: "official123", role: "official" },
  ];

  // Hash passwords
  for (let user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;
  }

  await User.insertMany(users);
  console.log("Users seeded!");
  mongoose.disconnect();
};

seedUsers();
