import mongoose from "mongoose";
import { invitationSchema } from "./schemas/invitationSchema.js";

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;