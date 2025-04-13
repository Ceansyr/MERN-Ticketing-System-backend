export const availabilityMethods = {
  isAvailable: function(day, time) {
    const daySchedule = this.availability.find(a => a.day === day);
    if (!daySchedule) return false;
    
    return daySchedule.slots.some(slot => 
      time >= slot.startTime && time <= slot.endTime
    );
  }
};