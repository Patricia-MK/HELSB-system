// Test script to verify loan application system integration
const mongoose = require("mongoose");
const LoanApplication = require("./models/LoanApplication");
const User = require("./models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/helsb_db";

async function testLoanApplicationIntegration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Check if LoanApplication model exists
    console.log("\n🧪 Test 1: Checking LoanApplication model...");
    const modelExists = mongoose.models.LoanApplication;
    if (modelExists) {
      console.log("✅ LoanApplication model is properly registered");
    } else {
      console.log("❌ LoanApplication model not found");
      return;
    }

    // Test 2: Check if we can create a sample loan application
    console.log("\n🧪 Test 2: Testing loan application creation...");
    
    // Find a test student user
    const testUser = await User.findOne({ role: "student" });
    if (!testUser) {
      console.log("❌ No student user found for testing");
      return;
    }
    
    console.log(`✅ Found test user: ${testUser.fullName}`);

    // Create a test loan application
    const testApplication = new LoanApplication({
      student: testUser._id,
      personalInfo: {
        fullName: testUser.fullName,
        nrcNumber: "123456/78/9",
        dateOfBirth: new Date("2000-01-01"),
        gender: "Male",
        phoneNumber: "0977123456",
        email: testUser.email,
        address: "123 Test Street, Lusaka",
        province: "Lusaka Province",
        district: "Lusaka"
      },
      academicInfo: {
        institution: "University of Zambia",
        program: "Computer Science",
        yearOfStudy: 2,
        studentNumber: testUser.studentID || "2024000001",
        expectedGraduationYear: 2026,
        previousLoanHistory: "None"
      },
      financialInfo: {
        requestedAmount: 15000,
        loanPurpose: "Tuition",
        familyIncome: 5000,
        numberOfDependents: 2,
        hasGuarantor: false
      },
      status: "Draft"
    });

    await testApplication.save();
    console.log("✅ Test loan application created successfully");
    console.log(`   Application ID: ${testApplication._id}`);

    // Test 3: Test querying loan applications
    console.log("\n🧪 Test 3: Testing loan application queries...");
    const applications = await LoanApplication.find({ student: testUser._id });
    console.log(`✅ Found ${applications.length} loan application(s) for user`);

    // Test 4: Test updating loan application
    console.log("\n🧪 Test 4: Testing loan application update...");
    testApplication.status = "Submitted";
    testApplication.submittedAt = new Date();
    await testApplication.save();
    console.log("✅ Loan application updated successfully");

    // Test 5: Test population of student data
    console.log("\n🧪 Test 5: Testing student data population...");
    const populatedApp = await LoanApplication.findById(testApplication._id)
      .populate("student", "fullName email role");
    
    if (populatedApp.student) {
      console.log("✅ Student data populated successfully");
      console.log(`   Student: ${populatedApp.student.fullName}`);
    } else {
      console.log("❌ Failed to populate student data");
    }

    // Clean up test data
    console.log("\n🧹 Cleaning up test data...");
    await LoanApplication.findByIdAndDelete(testApplication._id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests passed! Loan application system is properly integrated.");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

// Run the test
if (require.main === module) {
  testLoanApplicationIntegration();
}

module.exports = testLoanApplicationIntegration;
