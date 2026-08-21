import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

interface JwtPayload {
  userId: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const generateRegistrationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateVerificationCode = (length: number = env.VERIFICATION_CODE_LENGTH): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
};
