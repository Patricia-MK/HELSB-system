const mongoose = require("mongoose");

const studappProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "StudappSchool", required: true },
    duration: { type: Number },
  },
  { timestamps: true }
);

studappProgramSchema.index({ name: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model("StudappProgram", studappProgramSchema);


