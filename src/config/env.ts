import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().url(),
  
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_SECURE: z.string().transform((val) => val === "true"),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
  
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX: z.string().transform(Number).default("100"),
  
  VERIFICATION_CODE_LENGTH: z.string().transform(Number).default("8"),
  VERIFICATION_CODE_EXPIRY_MINUTES: z.string().transform(Number).default("15"),
  VERIFICATION_MAX_ATTEMPTS: z.string().transform(Number).default("5"),
  VERIFICATION_RESEND_MAX_PER_HOUR: z.string().transform(Number).default("3"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
