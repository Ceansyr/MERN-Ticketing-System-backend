import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import ChatbotSettings from "../models/ChatbotSettings.js";

export const ChatbotService = {
  processMessage: async (userId, message) => {
    const lowerMessage = message.toLowerCase();
    
    const processedAt = new Date();
    
    let response = {
      type: "message",
      processedAt,
      automated: true
    };
    
    if (lowerMessage.includes("create ticket") || lowerMessage.includes("new ticket") || lowerMessage.includes("submit ticket")) {
      response.intent = "createTicket";
      response.message = "I can help you create a ticket. Please provide a title and description.";
      return response;
    }
    
    if (lowerMessage.includes("ticket status") || lowerMessage.includes("my tickets")) {
      const recentTickets = await Ticket.find({ reporter: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title status createdAt");
      
      if (recentTickets.length === 0) {
        response.message = "You don't have any tickets yet. Would you like to create one?";
        return response;
      }
      
      response.type = "ticketList";
      response.message = "Here are your recent tickets:";
      response.tickets = recentTickets;
      return response;
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("assistance")) {
      response.message = "I can help you with the following:\n" +
        "- Creating a new ticket\n" +
        "- Checking ticket status\n" +
        "- Finding FAQs\n" +
        "Note: This is an automated response system. For real-time assistance, please create a ticket.";
      return response;
    }
    
    response.message = "I'm an automated response system. I can help you create tickets or check their status. " +
      "For real-time assistance, please create a ticket and our team will respond as soon as possible.";
    return response;
  },

  createTicketFromChat: async (userId, ticketData) => {
    const { title, description } = ticketData;
    
    if (!title || !description) {
      throw new Error("Title and description are required");
    }
    
    const ticket = new Ticket({
      title,
      description,
      reporter: userId,
      status: "new",
      priority: "medium",
      category: "chatbot",
      source: "automated_chat",
      createdAt: new Date()
    });
    
    await ticket.save();
    
    return {
      ticket,
      message: "Ticket created successfully. Our team will review and respond to your ticket soon.",
      automated: true
    };
  },
  
  findAvailableAdmin: async () => {
    const admin = await User.findOne({ role: "admin" }).sort({ _id: 1 });
    return admin;
  },
  
  saveGuestChatMessage: async (ticketId, message, guestInfo) => {
    const chatMessage = new Chat({
      ticketId,
      message: message,
      guestInfo: guestInfo,
      isGuest: true,
      timestamp: new Date()
    });
    
    return chatMessage.save();
  },
    
  getSettings: async (userId) => {
    try {
      let settings = await ChatbotSettings.findOne({ userId });
      
      if (!settings) {
        settings = new ChatbotSettings({ userId });
      }
      
      return settings;
    } catch (error) {
      throw new Error(`Error getting chatbot settings: ${error.message}`);
    }
  },

  updateSettings: async (userId, settingsData) => {
    try {
      const settings = await ChatbotSettings.findOneAndUpdate(
        { userId },
        { ...settingsData, userId },
        { new: true, upsert: true }
      );
      
      return settings;
    } catch (error) {
      throw new Error(`Error updating chatbot settings: ${error.message}`);
    }
  },
};
