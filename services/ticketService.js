import Ticket from "../models/Ticket.js";

const USER_POPULATE_FIELDS = "firstName lastName email profilePicture";

// Shared pagination helper
const paginateResults = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const results = await query
    .populate("reporter", USER_POPULATE_FIELDS)
    .populate("assignee", USER_POPULATE_FIELDS)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
  
  return results;
};

export const TicketService = {
  getTickets: async (filter = {}, page = 1, limit = 10) => {
    const query = Ticket.find(filter);
    const tickets = await paginateResults(query, page, limit);
    const total = await Ticket.countDocuments(filter);
    
    return {
      tickets,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  },

  searchTickets: async (query, filter = {}, page = 1, limit = 10) => {
    const searchFilter = {
      ...filter,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { ticketId: { $regex: query, $options: "i" } }
      ]
    };
    
    const mongoQuery = Ticket.find(searchFilter);
    const tickets = await paginateResults(mongoQuery, page, limit);
    const total = await Ticket.countDocuments(searchFilter);
    
    return {
      tickets,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  },

  getTicketById: async (id) => {
    const ticket = await Ticket.findById(id)
      .populate("reporter", USER_POPULATE_FIELDS)
      .populate("assignee", USER_POPULATE_FIELDS);
    
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  },

  createTicket: async (ticketData) => {
    const newTicket = new Ticket(ticketData);
    return newTicket.save();
  },

  updateTicket: async (id, updateData) => {
    const ticket = await Ticket.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: Date.now() }, 
      { new: true }
    );
    
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  },

  deleteTicket: async (id) => {
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  },

  assignTicket: async (id, assigneeId) => {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { 
        assignee: assigneeId,
        status: assigneeId ? "staged" : "backlog",
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  },

  updateStatus: async (id, status) => {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  },

  getTicketCount: async () => {
    try {
      const count = await Ticket.countDocuments();
      return count;
    } catch (error) {
      console.error("Error getting ticket count:", error);
      return 0;
    }
  }
};



