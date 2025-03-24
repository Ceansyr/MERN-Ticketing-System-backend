import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {

    console.log("Cookies:", req.cookies); // Debug cookies
    console.log("Authorization Header:", req.headers.authorization); // Debug header
    
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // ✅ Support cookies & headers
    console.log("Token received:", token);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // ✅ Attach user to request

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token, please log in again" });
    console.log(error);
  }
};

export default authMiddleware;
