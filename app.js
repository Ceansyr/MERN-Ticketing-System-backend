import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { corsOptions, corsMiddleware } from "./config/cors.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, logMiddleware } from "./middleware/index.js";

const app = express();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(corsMiddleware);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logMiddleware);

app.use("/api", apiRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;