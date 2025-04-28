import { ChatbotService } from "../services/chatbotService.js";

export const ChatbotController = {
  processMessage: async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await ChatbotService.processMessage(req.user._id, message);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTicket: async (req, res) => {
    try {
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }
      
      const ticket = await ChatbotService.createTicketFromChat(req.user._id, { title, description });
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};