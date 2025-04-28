import jwt from "jsonwebtoken";
import User from "../models/User.js";
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
    return req.cookies?.token || req.headers.authorization?.split(" ")[1];
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
  
  registerUser: async (userData) => {
    const { email } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    // Create new user
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