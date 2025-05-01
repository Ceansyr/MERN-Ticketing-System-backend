import User from "../models/User.js";
import Invitation from "../models/Invitation.js";

export const TeamService = {
  getTeamMembers: async (adminId) => {
    const members = await User.find({ 
      $or: [
        { _id: adminId },
        { adminId: adminId }
      ]
    }).select("-password");
    
    return members;
  },

  getTeamMemberById: async (id) => {
    const member = await User.findById(id).select("-password");
    
    if (!member) throw new Error("Team member not found");
    return member;
  },

  addTeamMember: async (memberData) => {
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const newMember = new User({
      ...memberData,
      password: tempPassword,
      isTemporaryPassword: true
    });
    
    return newMember.save();
  },

  updateTeamMember: async (id, updateData) => {
    const member = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select("-password");
    
    if (!member) throw new Error("Team member not found");
    return member;
  },

  deleteTeamMember: async (id) => {
    const member = await User.findByIdAndDelete(id);
    if (!member) throw new Error("Team member not found");
    return member;
  },

  inviteTeamMember: async (adminId, email, firstName, lastName, role = "Member") => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    const invitation = new Invitation({
      email,
      firstName,
      lastName,
      adminId,
      role: role.toLowerCase(),
      status: "pending"
    });
    
    return invitation.save();
  },
  
  getPendingInvitations: async (adminId) => {
    return Invitation.find({ 
      adminId, 
      status: "pending" 
    }).sort({ createdAt: -1 });
  },
  
  checkInvitation: async (email) => {
    const invitation = await Invitation.findOne({ 
      email, 
      status: "pending" 
    }).populate("adminId", "firstName lastName email");
    
    if (!invitation) {
      throw new Error("No pending invitation found for this email");
    }
    
    return invitation;
  },
  
  acceptInvitation: async (invitationId, userData) => {
    const invitation = await Invitation.findById(invitationId);
    
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    
    if (invitation.status !== "pending") {
      throw new Error("Invitation has already been used");
    }
    
    const user = new User({
      ...userData,
      firstName: invitation.firstName || userData.firstName,
      lastName: invitation.lastName || userData.lastName,
      email: invitation.email,
      adminId: invitation.adminId,
      role: invitation.role || "Member"
    });
    
    await user.save();
    
    invitation.status = "accepted";
    await invitation.save();
    
    return user;
  }
};

