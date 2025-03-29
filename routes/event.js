import express from "express";
import dotenv from "dotenv";

import Event from "../models/Event.js";
import errorHandler from "../middleware/errorMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      if (category === "past") {
        filter.status = "past";
        filter.date = { $lt: new Date() };
      } else if (["upcoming", "pending", "canceled"].includes(category)) {
        filter.status = category;
      }
    }

    const userId = req.user._id;
    const events = await Event.find({
      $or: [{ createdBy: userId }, { participants: userId }],
    }, filter).populate("participants", "username email").populate("createdBy", "username email");  
    res.json(events);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      title,
      description,
      date,
      duration,
      time,
      bannerImage,
      backgroundColor,
      eventLink,
      password,
      participants,
      status,
      isActive,
    } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      date,
      duration,
      time,
      bannerImage,
      backgroundColor,
      eventLink,
      password,
      participants, 
      status,
      isActive,
      createdBy: userId,
    });
    
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: "Failed to update event", error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (error) {
    errorHandler(error, req, res);
  }
});


router.put("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.isActive = isActive;
    await event.save();
    res.json(event);
  } catch (error) {
    errorHandler(error, req, res);
  }
});


export default router;