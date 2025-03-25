import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["upcoming", "pending", "canceled"],
    default: "upcoming",
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;