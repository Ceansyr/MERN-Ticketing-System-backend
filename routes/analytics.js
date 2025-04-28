import express from "express";
import { AnalyticsController } from "../controllers/analyticsController.js";
import { requireAdminOrMember } from "../middleware/accessControl.js";

const router = express.Router();

router.get("/stats", requireAdminOrMember, AnalyticsController.getTicketStats);
router.get("/team-performance", requireAdminOrMember, AnalyticsController.getTeamPerformance);
router.get("/resolution-time", requireAdminOrMember, AnalyticsController.getResolutionTimeStats);

export default router;