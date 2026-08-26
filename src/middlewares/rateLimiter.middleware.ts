import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "development",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per window
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  skip: () => env.NODE_ENV === "development",
});

export const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: env.VERIFICATION_RESEND_MAX_PER_HOUR,
  message: {
    success: false,
    message: "Too many resend attempts, please try again after an hour.",
  },
  skip: () => env.NODE_ENV === "development",
});
