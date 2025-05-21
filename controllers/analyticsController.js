import { AnalyticsService } from "../services/analyticsService.js";

export const AnalyticsController = {
  getTicketStats: async (req, res) => {
    try {
      const stats = await AnalyticsService.getTicketStats(null);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getTeamPerformance: async (req, res) => {
    try {
      const performance = await AnalyticsService.getTeamPerformance(null);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getResolutionTimeStats: async (req, res) => {
    try {
      const stats = await AnalyticsService.getResolutionTimeStats(null);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getMissedChatsData: async (req, res) => {
    try {
      const missedChatsData = await AnalyticsService.getMissedChatsData(null);
      res.json(missedChatsData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};