import express from "express";

const router = express.Router();

// Define your event routes here
router.get("/", (req, res) => {
  res.send("Event route is working!");
});

export default router;