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
  origin: ["http://localhost:5000", "https://astonishing-smakager-a8b308.netlify.app/"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};
app.use(cors(corsOptions));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); 
});

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
      serverSelectionTimeoutMS: 20000
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

app.use(errorHandler); 

app.get("/", (req, res) => {
  res.send("API is running...");
});