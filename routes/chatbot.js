import express from "express";
import { ChatbotController } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes that require authentication
router.post("/message", authMiddleware, ChatbotController.processMessage);
router.post("/ticket", authMiddleware, ChatbotController.createTicket);

// Public routes for guest users
router.post("/guest", ChatbotController.createGuestUser);
router.post("/guest/ticket", ChatbotController.createGuestTicket);

export default router; 