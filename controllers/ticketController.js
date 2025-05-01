import { TicketService } from "../services/ticketService.js";
import { ChatService } from "../services/chatService.js";

export const TicketController = {
  getTickets: async (req, res, next) => {
    const { page = 1, limit = 10, status, priority, assignee, source } = req.query;

    let filter = {};
    if (req.user.role === "admin") {
      filter.adminId = req.user._id;
    } else if (req.user.role === "member") {
      filter.adminId = req.user.adminId;
    } else {
      filter.reporter._id = req.user._id;
    }

    if (status) {
      const statusArray = status.split(",");
      filter.status = { $in: statusArray };
    }
    
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (source) filter.source = source;

    try {
      const result = await TicketService.getTickets(filter, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getTicketById: async (req, res, next) => {
    try {
      const ticket = await TicketService.getTicketById(req.params.id);

      if (
        (req.user.role === "admin" && ticket.reporter._id.toString() !== req.user._id.toString()) ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(ticket);
    } catch (error) {
      next(error);
    }
  },

  createTicket: async (req, res, next) => {
    try {
      const { title, description, priority } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }

      const ticketData = {
        title,
        description,
        priority: priority || "medium",
        reporter: req.user._id,
        status: "backlog",
        adminId: req.user.adminId || req.user._id,
        ticketId: `Ticket# ${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
      };

    
      const ticket = await TicketService.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  updateTicket: async (req, res, next) => {
    try {
      const ticket = await TicketService.getTicketById(req.params.id);

      if (
        (req.user.role === "admin" && ticket.reporter._id.toString() !== req.user._id.toString()) ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedTicket = await TicketService.updateTicket(req.params.id, req.body);
      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  },

  deleteTicket: async (req, res, next) => {
    try {
      const ticket = await TicketService.getTicketById(req.params.id);

      if (req.user.role !== "admin" || ticket.adminId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      await TicketService.deleteTicket(req.params.id);
      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  assignTicket: async (req, res, next) => {
    const { assigneeId } = req.body;

    try {
      const ticket = await TicketService.getTicketById(req.params.id);

      if (
        req.user.role === "admin" ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedTicket = await TicketService.assignTicket(req.params.id, assigneeId);
      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    const { status } = req.body;

    try {
      const ticket = await TicketService.getTicketById(req.params.id);

      if (
        (req.user.role === "admin" && ticket.reporter._id.toString() !== req.user._id.toString()) ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedTicket = await TicketService.updateStatus(req.params.id, status);
      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  },

  searchTickets: async (req, res, next) => {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let filter = {};
    if (req.user.role === "admin") {
      filter.adminId = req.user._id;
    } else if (req.user.role === "member") {
      filter.adminId = req.user.adminId;
    } else {
      filter.reporter._id = req.user._id;
    }

    try {
      const result = await TicketService.searchTickets(query, filter, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  replyToTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Reply message is required" });
      }
      
      const ticket = await TicketService.getTicketById(id);
      
      if (
        (req.user.role === "admin" && ticket.adminId.toString() !== req.user._id.toString()) ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const reply = await ChatService.createMessage(id, req.user._id, message);
      
      await TicketService.updateTicket(id, { updatedAt: Date.now() });
      
      res.status(201).json({
        success: true,
        message: "Reply sent successfully",
        reply
      });
    } catch (error) {
      next(error);
    }
  },
  
  getTicketMessages: async (req, res, next) => {
    try {
      const ticket = await TicketService.getTicketById(req.params.id);
  
      if (
        (req.user.role === "admin" && ticket.adminId.toString() !== req.user._id.toString()) ||
        (req.user.role === "member" && ticket.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messages = await ChatService.getTicketChats(req.params.id);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
};

