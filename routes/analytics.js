import express from "express";
import { AnalyticsController } from "../controllers/analyticsController.js";
import { requireAdminOrMember } from "../middleware/accessControl.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", requireAdminOrMember, AnalyticsController.getTicketStats);
router.get("/team-performance", requireAdminOrMember, AnalyticsController.getTeamPerformance);
router.get("/resolution-time", requireAdminOrMember, AnalyticsController.getResolutionTimeStats);
router.get("/missed-chats", requireAdminOrMember, AnalyticsController.getMissedChatsData);

export default router;