import { TeamService } from "../services/teamService.js";

export const TeamController = {
  getTeamMembers: async (req, res) => {
    try {
      // Only admin can view team members
      const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
      
      if (!adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const members = await TeamService.getTeamMembers(adminId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  inviteTeamMember: async (req, res) => {
    try {
      // Only admin can invite team members
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const invitation = await TeamService.inviteTeamMember(req.user._id, email);
      res.status(201).json(invitation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  removeTeamMember: async (req, res) => {
    try {
      // Only admin can remove team members
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { memberId } = req.params;
      
      if (!memberId) {
        return res.status(400).json({ message: "Member ID is required" });
      }
      
      const result = await TeamService.removeTeamMember(req.user._id, memberId);
      res.json({ message: "Team member removed successfully", user: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  getPendingInvitations: async (req, res) => {
    try {
      // Only admin can view pending invitations
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const invitations = await TeamService.getPendingInvitations(req.user._id);
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  checkInvitation: async (req, res) => {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const invitation = await TeamService.checkInvitation(email);
      res.json(invitation || { exists: false });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  acceptInvitation: async (req, res) => {
    try {
      const { invitationId } = req.params;
      
      if (!invitationId) {
        return res.status(400).json({ message: "Invitation ID is required" });
      }
      
      const result = await TeamService.acceptInvitation(invitationId, req.user._id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};