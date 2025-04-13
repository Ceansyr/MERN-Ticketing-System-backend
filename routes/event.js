import express from "express";
import { EventController } from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, EventController.getEvents);
router.post("/", authMiddleware, EventController.createEvent);
router.put("/:id", authMiddleware, EventController.updateEvent);
router.delete("/:id", authMiddleware, EventController.deleteEvent);
router.put("/:id/toggle", authMiddleware, EventController.toggleEventStatus);
router.post("/update-statuses", EventController.updateEventStatuses);

export const eventRouter = router;