import express from "express";
import dotenv from "dotenv";

import Event from "../models/event.js";
import errorHandler from "../middleware/errorMiddleware.js";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, date, time, status, isActive } = req.body;
    const newEvent = new Event({ title, date, time, status, isActive });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.delete("/:id", async (req, res) => {
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

router.put("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; // Frontend sends the desired state
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