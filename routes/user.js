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


export default router;