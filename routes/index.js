import express from "express";
import authRoutes from "./auth.js";
import ticketRoutes from "./ticket.js";
import teamRoutes from "./team.js";
import analyticsRoutes from "./analytics.js";
import chatbotRoutes from "./chatbot.js";
import userRoutes from "./user.js";

const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/team", teamRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/user", userRoutes);

export default router;