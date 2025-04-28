import mongoose from "mongoose";
import { ticketSchema } from "./schemas/ticketSchema.js";

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;