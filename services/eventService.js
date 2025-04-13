import Event from "../models/Event.js";

export class EventService {
  static async getEvents(category, userId) {
    let filter = {};
    if (category) {
      if (category === "past") {
        filter.status = "past";
        filter.date = { $lt: new Date() };
      } else if (["upcoming", "pending", "canceled"].includes(category)) {
        filter.status = category;
      }
    }

    return Event.find({
      $or: [{ createdBy: userId }, { participants: userId }],
    }, filter).populate("participants", "username email").populate("createdBy", "username email");
  }

  static async createEvent(eventData) {
    const newEvent = new Event(eventData);
    return newEvent.save();
  }

  static async updateEvent(id, updateData) {
    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!event) throw new Error("Event not found");
    return event;
  }

  static async deleteEvent(id) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error("Event not found");
    return event;
  }

  static async toggleStatus(id, isActive) {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");
    event.isActive = isActive;
    return event.save();
  }

  static async updateStatuses(events) {
    const updates = events.map(event => 
      Event.findByIdAndUpdate(event._id, { status: event.status })
    );
    return Promise.all(updates);
  }
}