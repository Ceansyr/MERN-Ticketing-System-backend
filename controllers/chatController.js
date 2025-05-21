import { ChatService } from "../services/chatService.js";
export const ChatController = {
  getChats: async (req, res, next) => {
    try {
      const filter = req.user.role === "admin" 
        ? {}
        : { adminId: req.user.adminId };
        
      const chats = await ChatService.getChats(filter);
      res.json({ chats });
    } catch (error) {
      next(error);
    }
  }
};