import { AuthService } from "../services/authService.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = AuthService.extractTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }
    
    const decoded = await AuthService.verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token format" });
    }
    
    const user = await AuthService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid token, please log in again" });
  }
};
