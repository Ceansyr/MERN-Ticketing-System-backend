import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);

// Protected routes
router.get("/me", authMiddleware, AuthController.getCurrentUser);

export default router;