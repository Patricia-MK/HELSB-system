const mongoose = require("mongoose");

const studappSchoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "StudappUniversity", required: true },
    duration: { type: Number },
  },
  { timestamps: true }
);

studappSchoolSchema.index({ name: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model("StudappSchool", studappSchoolSchema);


