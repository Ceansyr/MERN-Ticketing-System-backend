import Ticket from "../models/Ticket.js";

export const ChatbotService = {
  processMessage: async (userId, message) => {
    // Simple keyword-based responses with response delay simulation
    const lowerMessage = message.toLowerCase();
    
    // Add timestamp to track when the message was processed
    const processedAt = new Date();
    
    let response = {
      type: "message",
      processedAt,
      automated: true
    };
    
    // Check for ticket creation intent
    if (lowerMessage.includes("create ticket") || lowerMessage.includes("new ticket") || lowerMessage.includes("submit ticket")) {
      response.intent = "createTicket";
      response.message = "I can help you create a ticket. Please provide a title and description.";
      return response;
    }
    
    // Check for ticket status intent
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
    
    // Check for help intent
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("assistance")) {
      response.message = "I can help you with the following:\n" +
        "- Creating a new ticket\n" +
        "- Checking ticket status\n" +
        "- Finding FAQs\n" +
        "Note: This is an automated response system. For real-time assistance, please create a ticket.";
      return response;
    }
    
    // Default response
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
  }
};