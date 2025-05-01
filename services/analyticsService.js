import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

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
    const resolvedTickets = await Ticket.find({
      adminId,
      status: { $in: ["resolved", "closed"] }
    });
    
    let totalResolutionTime = 0;
    let ticketsWithResolutionTime = 0;
    
    resolvedTickets.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt);
      const updatedAt = new Date(ticket.updatedAt);
      const resolutionTime = (updatedAt - createdAt) / (1000 * 60 * 60);
      
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
  },
  
  getMissedChatsData: async (adminId) => {
    const tickets = await Ticket.find({ adminId }).select("_id");
    const ticketIds = tickets.map(ticket => ticket._id);
    
    const now = new Date();
    const tenWeeksAgo = new Date();
    tenWeeksAgo.setDate(now.getDate() - 70);
    
    const missedChats = await Chat.aggregate([
      {
        $match: {
          ticketId: { $in: ticketIds },
          isMissed: true,
          timestamp: { $gte: tenWeeksAgo }
        }
      },
      {
        $project: {
          weekNumber: { $week: "$timestamp" },
          year: { $year: "$timestamp" }
        }
      },
      {
        $group: {
          _id: { week: "$weekNumber", year: "$year" },
          missedChats: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      }
    ]);
    
    const formattedData = missedChats.map((item, index) => ({
      week: `Week ${index + 1}`,
      missedChats: item.missedChats
    }));
    
    while (formattedData.length < 10) {
      formattedData.push({
        week: `Week ${formattedData.length + 1}`,
        missedChats: 0
      });
    }
    
    return formattedData;
  }
};