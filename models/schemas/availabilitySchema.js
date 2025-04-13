import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";
import { timezoneValidator } from "../validators/timeValidators.js";
import { availabilitySlotSchema } from "./availabilitySlotSchema.js";

export const availabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  availability: [{
    day: {
      type: String,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true
    },
    slots: [availabilitySlotSchema]
  }],
  timeZone: {
    type: String,
    default: "UTC+5:30",
    validate: timezoneValidator
  }
}, baseSchemaOptions);