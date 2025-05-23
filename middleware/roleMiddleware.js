export const roleMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (roles.length === 0) {
        return next();
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: "Access denied. You don't have permission to access this resource." 
        });
      }
      
      next();
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  };
};