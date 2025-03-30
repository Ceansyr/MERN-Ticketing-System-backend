import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.js";
import errorHandler from "../middleware/errorMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    } else {
      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });

      user.token = token;
      await user.save();

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token,
      });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/preference", authMiddleware, async (req, res) => {
  try {
    const { username, preference } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.username = username;
      user.preference = preference;
      await user.save();

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        preference: user.preference,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "60d",
        }),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        preference: user.preference,
        token,
      });
    } else {
      res.status(401);
      throw new Error("Invalid username or password");
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

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
