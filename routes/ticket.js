import express from "express";
import { TicketController } from "../controllers/ticketController.js";
import { applyCommonMiddleware } from "../middleware/routeMiddleware.js";

const router = express.Router();

// Apply common middleware
applyCommonMiddleware(router);

// Ticket routes
router.get("/", TicketController.getTickets);
router.post("/", TicketController.createTicket);
router.get("/search", TicketController.searchTickets);
router.get("/:id", TicketController.getTicketById);
router.put("/:id", TicketController.updateTicket);
router.delete("/:id", TicketController.deleteTicket);
router.put("/:id/assign", TicketController.assignTicket);
router.put("/:id/status", TicketController.updateStatus);

export default router;