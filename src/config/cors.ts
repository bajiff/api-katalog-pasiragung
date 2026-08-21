import cors from "cors";
import { env } from "./env.js";

export const corsOptions: cors.CorsOptions = {
  origin: env.NODE_ENV === "development" 
    ? [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"]
    : env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
