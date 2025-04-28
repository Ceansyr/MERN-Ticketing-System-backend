import { roleMiddleware } from "./roleMiddleware.js"; 

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const requireAdminOrMember = roleMiddleware(["admin", "member"], (req, res, next) => {
  const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
  if (!adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.adminId = adminId; 
  next();
});

export const checkTicketAccess = async (req, res, next) => {
  try {
    const ticket = await req.ticket; 
    if (
      req.user.role === "admin" && ticket.reporter.toString() !== req.user._id.toString() ||
      (req.user.role === "agent" && ticket.adminId.toString() !== req.user.adminId.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};