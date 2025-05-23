import Chat from "../models/Chat.js";

export const ChatService = {
  getTicketChats: async (ticketId, page = 1, limit = 50) => {
    const skip = (page - 1) * limit;
    
    const chats = await Chat.find({ ticketId })
      .populate("sender", "firstName lastName profilePicture")
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit);
    
    return chats;
  },

  createMessage: async (ticketId, sender, message) => {
    const chat = new Chat({
      ticketId,
      sender,
      message,
      isGuest: false,
      isRead: false,
      timestamp: new Date()
    });
    
    return chat.save();
  },

  markAsRead: async (chatId) => {
    return Chat.findByIdAndUpdate(chatId, { isRead: true }, { new: true });
  },

  markAsMissed: async (ticketId, threshold = 15) => {
    const firstUnreadMessage = await Chat.findOne({
      ticketId,
      isRead: false
    }).sort({ timestamp: 1 });
    
    if (!firstUnreadMessage) return null;
    
    const now = new Date();
    const messageTime = new Date(firstUnreadMessage.timestamp);
    const diffMinutes = (now - messageTime) / (1000 * 60);
    
    if (diffMinutes > threshold) {
      await Chat.updateMany(
        { ticketId, isRead: false },
        { isMissed: true }
      );
      
      return true;
    }
    
    return false;
  }
};