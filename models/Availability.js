import mongoose from "mongoose";
import { availabilitySchema } from "./schemas/availabilitySchema.js";
import { availabilityMethods } from "./methods/availabilityMethods.js";

availabilitySchema.methods = availabilityMethods;

const Availability = mongoose.model("Availability", availabilitySchema);
export default Availability;
