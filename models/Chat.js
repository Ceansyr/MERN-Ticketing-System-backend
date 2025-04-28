import mongoose from "mongoose";
import { chatSchema } from "./schemas/chatSchema.js";

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;