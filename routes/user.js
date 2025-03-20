import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.js";
import errorHandler from "../middleware/errorMiddleware.js";

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
        password: password, // Password hashing will be handled in the User model
      });

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "60d",
        }),
      });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});


export default router;