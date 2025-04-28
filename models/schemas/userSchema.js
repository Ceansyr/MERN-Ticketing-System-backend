import mongoose from "mongoose";
import { baseSchemaOptions } from "./baseSchema.js";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    required: function() {
      return !this.email;
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"]
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String
  }
}, baseSchemaOptions);