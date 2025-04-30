import express from "express";
import { ChatbotController } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes that require authentication
router.post("/message", authMiddleware, ChatbotController.processMessage);
router.post("/ticket", authMiddleware, ChatbotController.createTicket);
router.get("/settings", authMiddleware, ChatbotController.getSettings);
router.put("/settings", authMiddleware, ChatbotController.updateSettings);

// Public routes for guest users
router.post("/guest", ChatbotController.createGuestUser);
router.post("/guest/ticket", ChatbotController.createGuestTicket);
// Public route to get chatbot settings (no auth required)
router.get("/settings/public", ChatbotController.getPublicSettings);

export default router;