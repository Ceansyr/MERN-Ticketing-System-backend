import User from "../models/User.js";
import Invitation from "../models/Invitation.js";

export const TeamService = {
  getTeamMembers: async (adminId) => {
    return User.find({ adminId })
      .select("-password")
      .sort({ firstName: 1 });
  },

  inviteTeamMember: async (adminId, email) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.adminId && existingUser.adminId.equals(adminId)) {
      throw new Error("User is already a member of your team");
    }
    
    // Create invitation
    const invitation = new Invitation({
      email,
      adminId
    });
    
    return invitation.save();
  },

  removeTeamMember: async (adminId, memberId) => {
    const member = await User.findOne({ _id: memberId, adminId });
    if (!member) {
      throw new Error("Team member not found");
    }
    
    // Remove admin association
    member.adminId = null;
    return member.save();
  },

  getPendingInvitations: async (adminId) => {
    return Invitation.find({ 
      adminId, 
      status: "pending" 
    });
  },

  checkInvitation: async (email) => {
    return Invitation.findOne({ 
      email, 
      status: "pending" 
    }).populate("adminId", "firstName lastName email");
  },

  acceptInvitation: async (invitationId, userId) => {
    const invitation = await Invitation.findById(invitationId)
      .populate("adminId", "password");
    
    if (!invitation) {
      throw new Error("Invitation not found or expired");
    }
    
    // Update user with admin ID and inherit admin"s password
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.adminId = invitation.adminId._id;
    user.password = invitation.adminId.password; // Inherit admin"s password
    await user.save();
    
    // Mark invitation as accepted
    invitation.status = "accepted";
    await invitation.save();
    
    return {
      message: "Invitation accepted successfully. Please change your password for security.",
      requirePasswordChange: true
    };
  }
};