import { AvailabilityService } from "../services/availabilityService.js";

export class AvailabilityController {
  static async getAvailability(req, res) {
    try {
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const availability = await AvailabilityService.getAvailability(req.params.userId);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async saveAvailability(req, res) {
    try {
      const userId = req.user._id;
      const { availability, timeZone } = req.body;
      const result = await AvailabilityService.saveAvailability(userId, availability, timeZone);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}