import { ChatbotService } from "../services/chatbotService.js";
import { TicketService } from "../services/ticketService.js";
import jwt from "jsonwebtoken";

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
  },
  
  createGuestUser: async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      const guestToken = jwt.sign(
        { name, email, phone, isGuest: true },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      
      res.status(201).json({ 
        token: guestToken,
        message: "Guest user created successfully" 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  createGuestTicket: async (req, res) => {
    try {
      const { title, description, contactInfo } = req.body;
      
      if (!title || !description || !contactInfo) {
        return res.status(400).json({ message: "Title, description, and contact info are required" });
      }
      
      const admin = await ChatbotService.findAvailableAdmin();
      
      if (!admin) {
        return res.status(500).json({ message: "No admin available to handle the ticket" });
      }
      
      const year = new Date().getFullYear();
      const count = await TicketService.getTicketCount() + 1;
      const ticketId = `Ticket# ${year}-${count.toString().padStart(5, "0")}`;
      
      const ticketData = {
        ticketId,
        title,
        description,
        priority: "medium",
        status: "backlog",
        guestInfo: contactInfo,
        source: "chat_widget"
      };
      
      const ticket = await TicketService.createTicket(ticketData);
      
      await ChatbotService.saveGuestChatMessage(ticket._id, description, contactInfo);
      
      res.status(201).json({
        message: "Ticket created successfully",
        ticketId: ticket.ticketId
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getSettings: async (req, res) => {
    try {
      const settings = await ChatbotService.getSettings(req.user._id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateSettings: async (req, res) => {
    try {
      const settings = req.body;
      
      if (!settings) {
        return res.status(400).json({ message: "Settings data is required" });
      }
      
      const updatedSettings = await ChatbotService.updateSettings(req.user._id, settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getPublicSettings: async (req, res) => {
    try {
      const admin = await ChatbotService.findAvailableAdmin();
      const settings = await ChatbotService.getSettings(admin?._id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};


