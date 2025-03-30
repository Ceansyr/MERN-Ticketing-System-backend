import express from "express";
import Availability from "../models/Availability.js";
import authMiddleware from "../middleware/authMiddleware.js";
import errorHandler from "../middleware/errorMiddleware.js";

const router = express.Router();
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const availability = await Availability.findOne({ userId: req.params.userId });
    if (!availability) {
      return res.status(404).json({ message: "No availability settings found" });
    }
    res.json(availability);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { availability, timeZone } = req.body;
    
    let userAvailability = await Availability.findOne({ userId });
    
    if (userAvailability) {
      userAvailability.availability = availability;
      userAvailability.timeZone = timeZone || userAvailability.timeZone;
    } else {
      userAvailability = new Availability({ userId, availability, timeZone });
    }
    
    await userAvailability.save();
    res.status(200).json(userAvailability);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

export default router;
