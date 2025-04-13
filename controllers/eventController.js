import { EventService } from "../services/eventService.js";

export class EventController {
  static async getEvents(req, res) {
    try {
      const { category } = req.query;
      const userId = req.user._id;
      const events = await EventService.getEvents(category, userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createEvent(req, res) {
    try {
      const userId = req.user._id;
      const eventData = { ...req.body, createdBy: userId };
      const newEvent = await EventService.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updatedEvent = await EventService.updateEvent(id, req.body);
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      res.json({ message: "Event deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleEventStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const event = await EventService.toggleStatus(id, isActive);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateEventStatuses(req, res) {
    try {
      const { events } = req.body;
      await EventService.updateStatuses(events);
      res.status(200).json({ message: "Event statuses updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}