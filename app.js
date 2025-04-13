import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { corsOptions, corsMiddleware } from "./config/cors.js";
import { userRouter } from "./routes/user.js";
import { eventRouter } from "./routes/event.js";
import { availabilityRouter } from "./routes/availability.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { log } from "./middleware/logMiddleware.js";

const app = express();

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(corsMiddleware);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(log);

// Routes
app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/availability", availabilityRouter);

// Error handling
app.use(errorHandler);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;