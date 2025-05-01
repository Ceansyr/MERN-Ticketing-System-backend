import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";

export const invitationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  },
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
    expires: 604800
  }
}, baseSchemaOptions);

invitationSchema.index({ email: 1, adminId: 1 }, { unique: true });