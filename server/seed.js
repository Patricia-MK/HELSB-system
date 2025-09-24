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
    // Student
    { fullName: "Dalitso Phiri", email: "dalitsophiri@gmail.com", password: "2021512258", role: "student", year: 4, studentID: "2021512258", loanNumber: "2110745461", nrcNo: "111111/10/1", program: "Civil Engineering", school: "School of Engineering", qualification: "Bachelor of Civil Engineering", institution: "University of Zambia" },
    { fullName: "Chaabilo Lubobya", email: "chaabilolubobya@gmail.com", password: "2021418235", role: "student", year: 4, studentID: "2021418235", loanNumber: "2110745466", nrcNo: "652523/10/1", program: "Computer Science", school: "School of Natural Sciences", qualification: "Bachelor of Computer Science", institution: "University of Zambia" },
    { fullName: "Patricia Mboma Kashweka", email: "patriciambomakashweka@gmail.com", password: "2021527433", role: "student", year: 3, studentID: "2021527433", loanNumber: "2110745463", nrcNo: "222222/10/1", program: "Economics", school: "School of Humanities", qualification: "Bachelor of Economics", institution: "University of Zambia" },
    { fullName: "John Banda", email: "johnbanda@gmail.com", password: "2024100001", role: "student", year: 1, studentID: "2024100001", loanNumber: "2110745470", nrcNo: "333333/10/1", program: "Medicine", school: "School of Medicine", qualification: "Bachelor of Medicine", institution: "University of Zambia" },
    { fullName: "Mary Zulu", email: "maryzulu@gmail.com", password: "2024100002", role: "student", year: 1, studentID: "2024100002", loanNumber: "2110745471", nrcNo: "444444/10/1", program: "Education", school: "School of Education", qualification: "Bachelor of Education", institution: "University of Zambia" },
    { fullName: "Peter Mwansa", email: "petermwansa@gmail.com", password: "2023100001", role: "student", year: 3, studentID: "2023100001", loanNumber: "2110745472", nrcNo: "555555/10/1", program: "Law", school: "School of Law", qualification: "Bachelor of Laws", institution: "University of Zambia" },
    { fullName: "Alice Phiri", email: "alicephiri@gmail.com", password: "2024100003", role: "student", year: 1, studentID: "2024100003", loanNumber: "2110745473", nrcNo: "666666/10/1", program: "Nursing", school: "School of Health Sciences", qualification: "Bachelor of Nursing", institution: "University of Zambia" },
    { fullName: "James Chanda", email: "jameschanda@gmail.com", password: "2022200001", role: "student", year: 2, studentID: "2022200001", loanNumber: "2110745474", nrcNo: "777777/10/1", program: "Agricultural Science", school: "School of Agriculture", qualification: "Bachelor of Agricultural Science", institution: "University of Zambia" },
    { fullName: "Linda Simukoko", email: "lindasimukoko@gmail.com", password: "2022100001", role: "student", year: 2, studentID: "2022100001", loanNumber: "2110745475", nrcNo: "888888/10/1", program: "Mathematics", school: "School of Natural Sciences", qualification: "Bachelor of Mathematics", institution: "University of Zambia" },
    { fullName: "Robert Tembo", email: "roberttembo@gmail.com", password: "2023100002", role: "student", year: 3, studentID: "2023100002", loanNumber: "2110745476", nrcNo: "999999/10/1", program: "Mechanical Engineering", school: "School of Engineering", qualification: "Bachelor of Mechanical Engineering", institution: "University of Zambia" },
    

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
