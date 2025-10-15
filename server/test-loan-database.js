const mongoose = require("mongoose");
const LoanApplication = require("./models/LoanApplication");

// Test database connection and model
async function testDatabaseConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/helsb_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB successfully");
    
    // Test creating a sample loan application
    const testApplication = new LoanApplication({
      personalDetails: {
        firstName: "John",
        otherName: "Michael",
        surname: "Doe",
        nrcNumber: "123456/78/9",
        dateOfBirth: new Date("1995-05-15"),
        gender: "Male",
        phoneNumber: "0977123456",
        districtOfResidence: "Lusaka",
        province: "Lusaka Province"
      },
      educationBackground: {
        lastSchoolAttended: "Lusaka Secondary School",
        examinationNumber: "1234567890",
        yearOfCompletion: 2020,
        schoolDistrict: "Lusaka"
      },
      guardian: {
        firstName: "Jane",
        surname: "Doe",
        nrcNumber: "987654/32/1",
        gender: "Female",
        occupation: "Teacher",
        phoneNumber: "0977654321",
        nationality: "Zambian",
        districtOfResidence: "Lusaka",
        relationshipToApplicant: "Mother"
      },
      university: {
        studentNumber: "STU123456",
        selectUniversity: "University of Zambia",
        enterSchool: "School of Engineering",
        enterProgram: "Computer Science",
        rateOfApplication: "100"
      }
    });
    
    // Save the test application
    const savedApplication = await testApplication.save();
    console.log("✅ Test application saved successfully");
    console.log("📋 Application Number:", savedApplication.applicationNumber);
    console.log("🆔 Application ID:", savedApplication._id);
    
    // Test retrieving the application
    const retrievedApplication = await LoanApplication.findById(savedApplication._id);
    console.log("✅ Application retrieved successfully");
    console.log("👤 Applicant Name:", `${retrievedApplication.personalDetails.firstName} ${retrievedApplication.personalDetails.surname}`);
    
    // Test counting applications
    const applicationCount = await LoanApplication.countDocuments();
    console.log("📊 Total applications in database:", applicationCount);
    
    // Clean up - delete test application
    await LoanApplication.findByIdAndDelete(savedApplication._id);
    console.log("🧹 Test application cleaned up");
    
    console.log("\n🎉 Database storage functionality test completed successfully!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testDatabaseConnection();
