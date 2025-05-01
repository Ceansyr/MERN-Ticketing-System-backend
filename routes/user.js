import express from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware, roleMiddleware } from "../middleware/index.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware(["admin"]), UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id/role", roleMiddleware(["admin"]), UserController.updateUserRole);
router.put("/:id/status", roleMiddleware(["admin"]), UserController.updateUserStatus);
router.delete("/:id", roleMiddleware(["admin"]), UserController.deleteUser);

router.put("/profile", UserController.updateUserProfile);

export default router;