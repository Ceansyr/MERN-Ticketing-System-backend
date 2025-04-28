import { AuthService } from "../services/authService.js";
import jwt from "jsonwebtoken";

export const AuthController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const user = await AuthService.authenticateUser(email, password);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "60d" });

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  },

  register: async (req, res, next) => {
    const { firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const user = await AuthService.registerUser({ firstName, lastName, email, password });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "60d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
      });

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: "admin",
        token
      });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  },

  logout: async (req, res, next) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  }
};