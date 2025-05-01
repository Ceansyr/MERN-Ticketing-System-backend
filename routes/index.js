import express from "express";
import authRoutes from "./auth.js";
import ticketRoutes from "./ticket.js";
import teamRoutes from "./team.js";
import analyticsRoutes from "./analytics.js";
import chatbotRoutes from "./chatbot.js";
import userRoutes from "./user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/tickets", authMiddleware, ticketRoutes);
router.use("/team", authMiddleware, teamRoutes);
router.use("/analytics", authMiddleware, analyticsRoutes);
router.use("/chatbot", authMiddleware, chatbotRoutes);
router.use("/user", authMiddleware, userRoutes);

export default router;