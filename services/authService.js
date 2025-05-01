import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import bcrypt from "bcrypt";

export const AuthService = {
  verifyToken: async (token) => {
    if (!token) {
      throw new Error("Not authorized, no token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  },

  getUserById: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  extractTokenFromRequest: (req) => {
    const cookieToken = req.cookies?.token;
    
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : null;
    
    return cookieToken || bearerToken;
  },
  
  authenticateUser: async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    
    return user;
  },
  
  authenticateInvitation: async (email, password) => {
    const invitation = await Invitation.findOne({ 
      email, 
      status: "pending" 
    }).populate("adminId");
    
    if (!invitation) {
      throw new Error("No pending invitation found for this email");
    }
    
    const admin = invitation.adminId;
    
    if (!admin) {
      throw new Error("Admin not found");
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    
    const existingUser = await User.findOne({ email: invitation.email });
    
    let user;
    
    if (existingUser) {
      existingUser.firstName = invitation.firstName || existingUser.firstName;
      existingUser.lastName = invitation.lastName || existingUser.lastName;
      existingUser.adminId = admin._id;
      existingUser.role = invitation.role;
      
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        existingUser.password = hashedPassword;
      }
      
      await existingUser.save();
      user = existingUser;
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      user = new User({
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        email: invitation.email,
        password: hashedPassword,
        adminId: admin._id,
        role: invitation.role
      });
      
      await user.save();
    }
    
    invitation.status = "accepted";
    await invitation.save();
    
    return user;
  },
  
  registerUser: async (userData) => {
    const { email } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    const user = new User(userData);
    await user.save();
    
    return user;
  },
  
  checkUserRole: async (userId, requiredRoles) => {
    const user = await AuthService.getUserById(userId);
    
    if (!requiredRoles.includes(user.role)) {
      throw new Error("Access denied");
    }
    
    return user;
  }
};