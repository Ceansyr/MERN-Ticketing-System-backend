import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";

export const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days in seconds
  }
}, baseSchemaOptions);

// Ensure email is unique per admin
invitationSchema.index({ email: 1, adminId: 1 }, { unique: true });