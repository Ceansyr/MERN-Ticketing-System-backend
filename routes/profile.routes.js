import express from "express";
import dotenv from "dotenv";

import User from "../models/User.js";
import { errorHandler, authMiddleware } from "../middleware/index.js";

dotenv.config();

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

export default router;