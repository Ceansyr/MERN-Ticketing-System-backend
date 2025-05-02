import express from "express";
import { TeamController } from "../controllers/teamController.js";
import { applyCommonMiddleware } from "../middleware/routeMiddleware.js";

const router = express.Router();

applyCommonMiddleware(router);

router.get("/members", TeamController.getTeamMembers);
router.post("/invite", TeamController.inviteTeamMember);
router.put("/members/:id", TeamController.updateTeamMember);
router.delete("/members/:id", TeamController.removeTeamMember);
router.get("/invitations", TeamController.getPendingInvitations);
router.get("/invitations/:email", TeamController.checkInvitation);
router.post("/invitations/:invitationId/accept", TeamController.acceptInvitation);

export default router;