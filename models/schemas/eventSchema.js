import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";

export const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
    maxLength: [100, "Title cannot be more than 100 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, "Description cannot be more than 500 characters"]
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: "Event date must be in the future"
    }
  },
  time: { type: String, required: true },
  duration: { type: String },
  bannerImage: String,
  backgroundColor: String,
  eventLink: { type: String, unique: true, sparse: true },
  password: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["upcoming", "pending", "canceled", "past"],
    default: "upcoming"
  },
  isActive: { type: Boolean, default: true }
}, baseSchemaOptions);