export const eventMethods = {
  isEditable: function() {
    return this.status !== "past" && this.status !== "canceled";
  },
  
  canJoin: function(userId) {
    return this.isActive && 
           !this.participants.includes(userId) && 
           this.status === "upcoming";
  }
};

export const eventStatics = {
  findUpcoming: function() {
    return this.find({
      date: { $gte: new Date() },
      status: "upcoming",
      isActive: true
    });
  }
};