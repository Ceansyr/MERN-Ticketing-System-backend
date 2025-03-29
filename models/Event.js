import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    date: { 
      type: Date, 
      required: true 
    },
    time: { 
      type: String, 
      required: true 
    },
    bannerImage: { 
      type: String 
    },
    backgroundColor: { 
      type: String 
    },
    eventLink: { 
      type: String 
    },
    password: { 
      type: String 
    },
    duration: { 
      type: String,
    },
    participants: { 
      type: [mongoose.Schema.Types.ObjectId], 
      ref: "User",
    },
    hostName: { 
      type: String, 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: {
      type: String,
      enum: ["upcoming", "pending", "canceled", "past"],
      default: "upcoming",
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
