import jwt from "jsonwebtoken";
import User from "../models/User.js";

export class AuthService {
  static async verifyToken(token) {
    if (!token) {
      throw new Error("Not authorized, no token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  }

  static async getUserById(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static extractTokenFromRequest(req) {
    return req.cookies?.token || req.headers.authorization?.split(" ")[1];
  }
}