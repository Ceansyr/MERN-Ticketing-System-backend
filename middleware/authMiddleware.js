import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // ✅ Support cookies & headers

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
