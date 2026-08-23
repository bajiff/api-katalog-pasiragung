import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { errorHandler, generalLimiter } from "./middlewares/index.js";
import routes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiter to all /api/v1 routes
app.use("/api/v1", generalLimiter);

// Routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorHandler);

export default app;
