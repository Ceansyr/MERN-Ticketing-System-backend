import express from "express";
import { TicketController } from "../controllers/ticketController.js";
import { applyCommonMiddleware } from "../middleware/routeMiddleware.js";

const router = express.Router();

applyCommonMiddleware(router);

router.get("/", TicketController.getTickets);
router.post("/", TicketController.createTicket);
router.get("/search", TicketController.searchTickets);
router.get("/:id", TicketController.getTicketById);
router.put("/:id", TicketController.updateTicket);
router.delete("/:id", TicketController.deleteTicket);
router.put("/:id/assign", TicketController.assignTicket);
router.put("/:id/status", TicketController.updateStatus);
router.post("/:id/reply", TicketController.replyToTicket);
router.get("/:id/messages", TicketController.getTicketMessages);

export default router;