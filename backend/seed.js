const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Application = require("./models/Application");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.error(err));

const applications = [
  { name: "John Doe", nrc: "12345678", program: "Computer Science", gpa: 3.8, documents: ["doc1.pdf", "doc2.pdf"] },
  { name: "Jane Smith", nrc: "87654321", program: "Information Systems", gpa: 3.5, documents: ["doc3.pdf"] },
  { name: "Peter Johnson", nrc: "11223344", program: "Software Engineering", gpa: 4.0, documents: ["doc4.pdf", "doc5.pdf"] }
];

const seedDB = async () => {
  try {
    await Application.deleteMany(); // remove all existing
    await Application.insertMany(applications);
    console.log("Database seeded!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
