import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashVerificationCode = (code: string): string => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

export const compareVerificationCode = (code: string, hash: string): boolean => {
  const hashedInput = hashVerificationCode(code);
  return crypto.timingSafeEqual(Buffer.from(hashedInput), Buffer.from(hash));
};
