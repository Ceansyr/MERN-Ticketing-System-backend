import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";

export const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, "Ticket title is required"],
    trim: true,
    maxLength: [100, "Title cannot be more than 100 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, "Description cannot be more than 500 characters"]
  },
  status: {
    type: String,
    enum: ["backlog", "staged", "in_progress", "in_review", "blocked", "resolved", "closed"],
    default: "backlog"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  source: {
    type: String,
    enum: ["web", "email", "phone", "chat_widget", "automated_chat"],
    default: "web"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resolvedAt: {
    type: Date
  },
}, baseSchemaOptions);

ticketSchema.pre("save", async function(next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Ticket").countDocuments() + 1;
    this.ticketId = `Ticket# ${year}-${count.toString().padStart(5, "0")}`;
  }
  this.updatedAt = Date.now();
  next();
});