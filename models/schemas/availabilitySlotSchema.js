import mongoose from "mongoose";
import { timeValidator } from "../validators/timeValidators.js";

export const availabilitySlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    validate: timeValidator
  },
  endTime: {
    type: String,
    required: true,
    validate: timeValidator
  }
}, { _id: false });

availabilitySlotSchema.pre("validate", function(next) {
  if (this.startTime && this.endTime) {
    if (this.startTime >= this.endTime) {
      this.invalidate("endTime", "End time must be after start time");
    }
  }
  next();
});