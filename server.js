import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/event.js";
import availabilityRoutes from "./routes/availability.js";

import errorHandler from "./middleware/errorMiddleware.js";
import log from "./middleware/logMiddleware.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173", // Local development
    "https://astonishing-smakager-a8b308.netlify.app", // Frontend production URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies and credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Custom middleware for setting headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://astonishing-smakager-a8b308.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight request
  }
  next();
});

// Other middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(log);

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("✅ MongoDB Connected Successfully!");
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

startServer();

// Error handler middleware
app.use(errorHandler);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});