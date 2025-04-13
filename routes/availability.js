import express from "express";
import { AvailabilityController } from "../controllers/availabilityController.js";
import { authMiddleware } from "../middleware/index.js";

const router = express.Router();

router.get("/:userId", authMiddleware, AvailabilityController.getAvailability);
router.post("/", authMiddleware, AvailabilityController.saveAvailability);

export const availabilityRouter = router;
