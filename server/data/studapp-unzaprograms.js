/*
  studapp-unzaprograms.js
  Idempotent seeder for Universities, Schools and Programs tailored to this project.
  - Includes all universities used in the client UI (adds Palabana University and ZUT)
  - Seeds detailed Schools/Programs for University of Zambia as a baseline

  Usage:
    node server/data/studapp-unzaprograms.js
  Env:
    MONGO_URI=mongodb://127.0.0.1:27017/helsb_db
*/

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/helsb_db";

// Inline lightweight schemas with unique indexes
const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "StudappUniversity", required: true },
    duration: { type: Number },
  },
  { timestamps: true }
);
schoolSchema.index({ name: 1, universityId: 1 }, { unique: true });

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "StudappSchool", required: true },
    duration: { type: Number },
  },
  { timestamps: true }
);
programSchema.index({ name: 1, schoolId: 1 }, { unique: true });

const University = mongoose.model("StudappUniversity", universitySchema);
const School = mongoose.model("StudappSchool", schoolSchema);
const Program = mongoose.model("StudappProgram", programSchema);

async function upsertUniversityNames() {
  const uniNames = [
    "Chalimbana University",
    "Copperbelt University",
    "Kapasa Makasa University",
    "Kwame Nkrumah University",
    "Mulungushi University",
    "Mukuba University",
    "Palabana University",
    "University of Zambia",
    "Zambia University College of Technology",
  ];
  for (const name of uniNames) {
    await University.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
}

async function seedAllUniversities() {
  const universityData = {
    "University of Zambia": {
      schools: [
        { name: "School of Agricultural Sciences", duration: 5 },
        { name: "School of Education", duration: 4 },
        { name: "School of Engineering", duration: 5 },
        { name: "School of Health Sciences", duration: 4 },
        { name: "School of Humanities and Social Sciences", duration: 4 },
        { name: "School of Law", duration: 4 },
        { name: "School of Medicine", duration: 6 },
        { name: "School of Mines", duration: 5 },
        { name: "School of Natural Sciences", duration: 4 },
        { name: "School of Nursing Sciences", duration: 4 },
        { name: "School of Public Health", duration: 5 },
        { name: "School of Veterinary Medicine", duration: 6 },
      ],
      programs: {
        "School of Engineering": [
          "Bachelor of Engineering-Civil and Environmental Engineering",
          "Bachelor of Engineering-Electrical and Electronic Engineering",
          "Bachelor of Engineering-Mechanical Engineering",
          "Bachelor of Engineering-Geomatic Engineering",
        ],
        "School of Natural Sciences": [
          "Bachelor of Computer Science in Computer Science",
          "Bachelor of Science in Mathematics",
          "Bachelor of Science in Statistics",
        ],
        "School of Medicine": [
          "Bachelor Of Medicine And Surgery",
        ],
      }
    },
    "Copperbelt University": {
      schools: [
        { name: "School of Engineering", duration: 5 },
        { name: "School of Natural Resources", duration: 4 },
        { name: "School of Business", duration: 4 },
        { name: "School of Education", duration: 4 },
      ],
      programs: {
        "School of Engineering": [
          "Bachelor of Engineering-Mining Engineering",
          "Bachelor of Engineering-Civil Engineering",
          "Bachelor of Engineering-Electrical Engineering",
        ],
        "School of Natural Resources": [
          "Bachelor of Science in Environmental Management",
          "Bachelor of Science in Forestry",
        ],
        "School of Business": [
          "Bachelor of Business Administration",
          "Bachelor of Commerce",
        ],
        "School of Education": [
          "Bachelor of Education",
        ],
      }
    },
    "Mulungushi University": {
      schools: [
        { name: "School of Business Studies", duration: 4 },
        { name: "School of Science, Engineering and Technology", duration: 5 },
        { name: "School of Education", duration: 4 },
      ],
      programs: {
        "School of Business Studies": [
          "Bachelor of Business Administration",
          "Bachelor of Accounting",
        ],
        "School of Science, Engineering and Technology": [
          "Bachelor of Science in Software Engineering",
          "Bachelor of Science in Information Technology",
        ],
        "School of Education": [
          "Bachelor of Education",
        ],
      }
    },
    "Mukuba University": {
      schools: [
        { name: "School of Natural Sciences", duration: 4 },
        { name: "School of Education", duration: 4 },
      ],
      programs: {
        "School of Natural Sciences": [
          "Bachelor of Science in Mathematics",
          "Bachelor of Science in Physics",
        ],
        "School of Education": [
          "Bachelor of Education",
        ],
      }
    },
    "Chalimbana University": {
      schools: [
        { name: "School of Education", duration: 4 },
        { name: "School of Agriculture", duration: 4 },
      ],
      programs: {
        "School of Education": [
          "Bachelor of Education",
        ],
        "School of Agriculture": [
          "Bachelor of Science in Agriculture",
        ],
      }
    },
    "Kapasa Makasa University": {
      schools: [
        { name: "School of Natural Sciences", duration: 4 },
        { name: "School of Education", duration: 4 },
      ],
      programs: {
        "School of Natural Sciences": [
          "Bachelor of Science in Mathematics",
        ],
        "School of Education": [
          "Bachelor of Education",
        ],
      }
    },
    "Kwame Nkrumah University": {
      schools: [
        { name: "School of Education", duration: 4 },
        { name: "School of Business", duration: 4 },
      ],
      programs: {
        "School of Education": [
          "Bachelor of Education",
        ],
        "School of Business": [
          "Bachelor of Business Administration",
        ],
      }
    },
    "Palabana University": {
      schools: [
        { name: "School of Agriculture", duration: 4 },
        { name: "School of Education", duration: 4 },
      ],
      programs: {
        "School of Agriculture": [
          "Bachelor of Science in Agricultural Sciences",
        ],
        "School of Education": [
          "Bachelor of Education",
        ],
      }
    },
    "Zambia University College of Technology": {
      schools: [
        { name: "School of Technology", duration: 4 },
        { name: "School of Engineering", duration: 5 },
      ],
      programs: {
        "School of Technology": [
          "Bachelor of Technology in Information Technology",
        ],
        "School of Engineering": [
          "Bachelor of Engineering",
        ],
      }
    },
  };

  for (const [uniName, data] of Object.entries(universityData)) {
    const university = await University.findOne({ name: uniName });
    if (!university) {
      console.log(`University ${uniName} not found, skipping...`);
      continue;
    }

    const schoolMap = {};
    for (const schoolSpec of data.schools) {
      await School.updateOne(
        { name: schoolSpec.name, universityId: university._id },
        { $set: { universityId: university._id, duration: schoolSpec.duration } },
        { upsert: true }
      );
      const schoolDoc = await School.findOne({ name: schoolSpec.name, universityId: university._id });
      schoolMap[schoolSpec.name] = schoolDoc;
    }

    // Add programs for each school
    for (const [schoolName, programNames] of Object.entries(data.programs)) {
      const school = schoolMap[schoolName];
      if (!school) continue;
      
      for (const programName of programNames) {
        await Program.updateOne(
          { name: programName, schoolId: school._id },
          { $set: { name: programName, schoolId: school._id, duration: school.duration } },
          { upsert: true }
        );
      }
    }
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected:", MONGO_URI);
  try {
    await upsertUniversityNames();
    await seedAllUniversities();
    console.log("studapp academic seed completed");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };


