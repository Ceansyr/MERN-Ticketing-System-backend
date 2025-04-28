export const requirePasswordChange = async (req, res, next) => {
  try {
    // Skip check for admin users
    if (req.user.role === "admin") {
      return next();
    }
    
    // If user has adminId and their password matches admin"s password
    if (req.user.adminId) {
      const admin = await User.findById(req.user.adminId).select("password");
      if (admin && req.user.password === admin.password) {
        return res.status(403).json({
          message: "Please change your password before continuing",
          requirePasswordChange: true
        });
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};