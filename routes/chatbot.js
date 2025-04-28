import express from "express";
import { ChatbotController } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Chatbot routes
router.post("/message", ChatbotController.processMessage);
router.post("/ticket", ChatbotController.createTicket);

export default router;