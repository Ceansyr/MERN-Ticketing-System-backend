import mongoose from "mongoose";
import { eventSchema } from "./schemas/eventSchema.js";
import { eventMethods, eventStatics } from "./methods/eventMethods.js";

eventSchema.methods = eventMethods;
eventSchema.statics = eventStatics;

const Event = mongoose.model("Event", eventSchema);
export default Event;
