import express from "express";
import { ChatbotController } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", authMiddleware, ChatbotController.processMessage);
router.post("/ticket", authMiddleware, ChatbotController.createTicket);
router.get("/settings", authMiddleware, ChatbotController.getSettings);
router.put("/settings", authMiddleware, ChatbotController.updateSettings);

router.post("/guest", ChatbotController.createGuestUser);
router.post("/guest/ticket", ChatbotController.createGuestTicket);
router.get("/settings/public", ChatbotController.getPublicSettings);

export default router;