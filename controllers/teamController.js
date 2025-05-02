import { TeamService } from "../services/teamService.js";

export const TeamController = {
  getTeamMembers: async (req, res, next) => {
    try {
      const adminId = req.user.role === "Admin" ? req.user._id : req.user.adminId;
      
      const members = await TeamService.getTeamMembers(adminId);
      res.json({ members });
    } catch (error) {
      next(error);
    }
  },

  inviteTeamMember: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can invite team members" });
      }

      const { email, firstName, lastName, role } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const invitation = await TeamService.inviteTeamMember(req.user._id, email, firstName, lastName, role || "Member");
      res.status(201).json(invitation);
    } catch (error) {
      next(error);
    }
  },

  updateTeamMember: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can update team members" });
      }

      const member = await TeamService.getTeamMemberById(req.params.id);
      
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }

      if (!member.adminId) {
        return res.status(400).json({ message: "Member has no associated admin" });
      }

      if (member.adminId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedMember = await TeamService.updateTeamMember(req.params.id, req.body);
      res.json(updatedMember);
    } catch (error) {
      next(error);
    }
  },

  removeTeamMember: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can remove team members" });
      }

      const member = await TeamService.getTeamMemberById(req.params.memberId);

      if (member.adminId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      await TeamService.deleteTeamMember(req.params.memberId);
      res.json({ message: "Team member removed successfully" });
    } catch (error) {
      next(error);
    }
  },
  
  getPendingInvitations: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const invitations = await TeamService.getPendingInvitations(req.user._id);
      res.json({ invitations });
    } catch (error) {
      next(error);
    }
  },
  
  checkInvitation: async (req, res, next) => {
    try {
      const { email } = req.params;
      const invitation = await TeamService.checkInvitation(email);
      res.json({ invitation });
    } catch (error) {
      next(error);
    }
  },
  
  acceptInvitation: async (req, res, next) => {
    try {
      const { invitationId } = req.params;
      const { firstName, lastName, password } = req.body;
      
      if (!firstName || !lastName || !password) {
        return res.status(400).json({ message: "First name, last name, and password are required" });
      }
      
      const user = await TeamService.acceptInvitation(invitationId, {
        firstName,
        lastName,
        password
      });
      
      res.status(201).json({
        message: "Invitation accepted successfully",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};