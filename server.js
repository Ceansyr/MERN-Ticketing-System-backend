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

// Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, 
};
app.use(cors(corsOptions));

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