import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

export const AnalyticsService = {
  getTicketStats: async () => {
    const totalTickets = await Ticket.countDocuments({});
    const resolvedTickets = await Ticket.countDocuments({ 
      status: { $in: ["resolved", "closed"] } 
    });
    const unresolvedTickets = await Ticket.countDocuments({ 
      status: { $nin: ["resolved", "closed"] } 
    });
    
    const ticketsByStatus = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const ticketsByPriority = await Ticket.aggregate([
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

  getTeamPerformance: async () => {
    const teamMembers = await User.find({}).select("_id firstName lastName adminId");
    
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

  getResolutionTimeStats: async () => {
    const resolvedTickets = await Ticket.find({
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
  
  getMissedChatsData: async () => {
    const tickets = await Ticket.find({}).select("_id");
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