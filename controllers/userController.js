import User from "../models/User.js";

export const UserController = {
  getAllUsers: async (req, res, next) => {
    try {
      const filter = req.user.role === "admin" 
        ? {} 
        : { adminId: req.user.adminId };
      
      const users = await User.find(filter).select("-password");
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (
        req.user.role !== "admin" && 
        user._id.toString() !== req.user._id.toString() &&
        (!user.adminId || user.adminId.toString() !== req.user.adminId.toString())
      ) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  updateUserRole: async (req, res, next) => {
    try {
      const { role } = req.body;
      
      if (!role || !["admin", "member"].includes(role)) {
        return res.status(400).json({ message: "Valid role is required" });
      }
      
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      user.role = role;
      await user.save();
      
      res.json({ message: "User role updated successfully", user });
    } catch (error) {
      next(error);
    }
  },

  updateUserStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      
      if (!status || !["active", "inactive", "suspended"].includes(status)) {
        return res.status(400).json({ message: "Valid status is required" });
      }
      
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      user.status = status;
      await user.save();
      
      res.json({ message: "User status updated successfully", user });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await User.findByIdAndDelete(req.params.id);
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
  
  updateUserProfile: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { firstName, lastName, email, phone, password } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (password) user.password = password;
  
      const updatedUser = await user.save();
  
      const userResponse = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      };
  
      res.json({ message: "Profile updated successfully", user: userResponse });
    } catch (error) {
      next(error);
    }
  }
};