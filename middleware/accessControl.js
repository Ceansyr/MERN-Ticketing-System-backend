export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const requireAdminOrMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (req.user.role !== "admin" && req.user.role !== "member") {
    return res.status(403).json({ 
      message: "Access denied. You don't have permission to access this resource." 
    });
  }
  
  const adminId = req.user.role === "admin" ? req.user._id : req.user.adminId;
  if (!adminId) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.adminId = adminId; 
  next();
};

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