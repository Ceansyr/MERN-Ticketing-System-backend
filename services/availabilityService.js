import Availability from "../models/Availability.js";

export class AvailabilityService {
  static async getAvailability(userId) {
    const availability = await Availability.findOne({ userId });
    if (!availability) throw new Error("No availability settings found");
    return availability;
  }

  static async saveAvailability(userId, availability, timeZone) {
    let userAvailability = await Availability.findOne({ userId });
    
    if (userAvailability) {
      userAvailability.availability = availability;
      userAvailability.timeZone = timeZone || userAvailability.timeZone;
    } else {
      userAvailability = new Availability({ userId, availability, timeZone });
    }
    
    return userAvailability.save();
  }
}