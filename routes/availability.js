import express from "express";

const availabilityRoutes = express.Router();

// Example route for getting availability
availabilityRoutes.get("/", (req, res) => {
  res.send("Get availability");
});

// Example route for creating availability
availabilityRoutes.post("/", (req, res) => {
  res.send("Create availability");
});

// Example route for updating availability
availabilityRoutes.put("/:id", (req, res) => {
  res.send(`Update availability with ID: ${req.params.id}`);
});

// Example route for deleting availability
availabilityRoutes.delete("/:id", (req, res) => {
  res.send(`Delete availability with ID: ${req.params.id}`);
});

export default availabilityRoutes;