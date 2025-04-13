import { AuthService } from "../services/authService.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = AuthService.extractTokenFromRequest(req);
    const decoded = await AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.id);
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token, please log in again" });
    console.log(error);
  }
};
