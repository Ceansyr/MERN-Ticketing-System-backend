import { AnalyticsService } from "../services/analyticsService.js";

export const AnalyticsController = {
  getTicketStats: async (req, res) => {
    try {
      if (req.user.role === "user") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
      
      if (!adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const stats = await AnalyticsService.getTicketStats(adminId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getTeamPerformance: async (req, res) => {
    try {
      if (req.user.role === "user") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
      
      if (!adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const performance = await AnalyticsService.getTeamPerformance(adminId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getResolutionTimeStats: async (req, res) => {
    try {
      if (req.user.role === "user") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
      
      if (!adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const stats = await AnalyticsService.getResolutionTimeStats(adminId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getMissedChatsData: async (req, res) => {
    try {
      if (req.user.role === "user") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
      
      if (!adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const missedChatsData = await AnalyticsService.getMissedChatsData(adminId);
      res.json(missedChatsData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};