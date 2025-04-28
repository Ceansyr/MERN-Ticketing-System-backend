import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const AnalyticsService = {
  getTicketStats: async (adminId) => {
    const totalTickets = await Ticket.countDocuments({ adminId });
    const resolvedTickets = await Ticket.countDocuments({ 
      adminId, 
      status: { $in: ["resolved", "closed"] } 
    });
    const unresolvedTickets = await Ticket.countDocuments({ 
      adminId, 
      status: { $nin: ["resolved", "closed"] } 
    });
    
    const ticketsByStatus = await Ticket.aggregate([
      { $match: { adminId: adminId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const ticketsByPriority = await Ticket.aggregate([
      { $match: { adminId: adminId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);
    
    return {
      totalTickets,
      resolvedTickets,
      unresolvedTickets,
      ticketsByStatus: ticketsByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      ticketsByPriority: ticketsByPriority.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };
  },

  getTeamPerformance: async (adminId) => {
    const teamMembers = await User.find({ adminId }).select("_id firstName lastName");
    
    const performance = await Promise.all(
      teamMembers.map(async (member) => {
        const assignedTickets = await Ticket.countDocuments({ assignee: member._id });
        const resolvedTickets = await Ticket.countDocuments({ 
          assignee: member._id,
          status: { $in: ["resolved", "closed"] }
        });
        
        return {
          member: {
            _id: member._id,
            name: `${member.firstName} ${member.lastName}`
          },
          assignedTickets,
          resolvedTickets,
          resolutionRate: assignedTickets > 0 ? (resolvedTickets / assignedTickets) * 100 : 0
        };
      })
    );
    
    return performance;
  },

  getResolutionTimeStats: async (adminId) => {
    // Calculate average time from creation to resolution
    const resolvedTickets = await Ticket.find({
      adminId,
      status: { $in: ["resolved", "closed"] }
    });
    
    let totalResolutionTime = 0;
    let ticketsWithResolutionTime = 0;
    
    resolvedTickets.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt);
      const updatedAt = new Date(ticket.updatedAt);
      const resolutionTime = (updatedAt - createdAt) / (1000 * 60 * 60); // in hours
      
      if (resolutionTime > 0) {
        totalResolutionTime += resolutionTime;
        ticketsWithResolutionTime++;
      }
    });
    
    const averageResolutionTime = ticketsWithResolutionTime > 0 
      ? totalResolutionTime / ticketsWithResolutionTime 
      : 0;
    
    return {
      averageResolutionTime,
      totalResolvedTickets: resolvedTickets.length
    };
  }
};