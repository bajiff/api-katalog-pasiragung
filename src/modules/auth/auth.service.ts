import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword, hashVerificationCode, compareVerificationCode } from "../../shared/hashUtils.js";
import { generateRegistrationToken, generateVerificationCode, signToken } from "../../shared/tokenUtils.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../shared/emailService.js";
import { env } from "../../config/env.js";

export const register = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(data.password);
  const registrationToken = generateRegistrationToken();

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "admin",
      status: "pending",
      registrationToken,
    },
  });

  return { registration_token: user.registrationToken };
};

export const getStatusByToken = async (token: string) => {
  const user = await prisma.user.findUnique({
    where: { registrationToken: token },
    select: { status: true },
  });

  if (!user) throw new Error("Invalid registration token");
  return { status: user.status };
};

export const verifyCode = async (token: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { registrationToken: token } });
  
  if (!user) throw new Error("Invalid registration token");
  if (user.status !== "awaiting_verification") throw new Error("Invalid status for verification");
  
  if (user.verificationAttempts >= env.VERIFICATION_MAX_ATTEMPTS) {
    throw new Error("Maximum verification attempts reached. Please request a new code.");
  }
  
  if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
    throw new Error("Verification code has expired");
  }
  
  if (!user.verificationCodeHash || !compareVerificationCode(code, user.verificationCodeHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationAttempts: { increment: 1 } },
    });
    throw new Error("Invalid verification code");
  }

  // Verification successful
  await prisma.user.update({
    where: { id: user.id },
    data: {
      status: "approved",
      verificationCodeHash: null,
      verificationCodeExpiresAt: null,
      registrationToken: generateRegistrationToken(), // Invalidate the old token
    },
  });

  return { message: "Account verified successfully. You can now login." };
};

export const resendCode = async (token: string) => {
  const user = await prisma.user.findUnique({ where: { registrationToken: token } });
  
  if (!user) throw new Error("Invalid registration token");
  if (user.status !== "awaiting_verification") throw new Error("Invalid status for resending code");

  // Check cooldown: Cannot resend if code is not expired AND attempts are not maxed out
  if (
    user.verificationCodeExpiresAt && 
    user.verificationCodeExpiresAt > new Date() &&
    user.verificationAttempts < env.VERIFICATION_MAX_ATTEMPTS
  ) {
    throw new Error("Current verification code is still valid. Please wait before requesting a new one.");
  }

  const newCode = generateVerificationCode();
  const codeHash = hashVerificationCode(newCode);
  const expiresAt = new Date(Date.now() + env.VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);

  // Send email first
  await sendVerificationEmail(user.email, newCode);

  // Then update DB
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationCodeHash: codeHash,
      verificationCodeExpiresAt: expiresAt,
      verificationAttempts: 0,
    },
  });

  return { message: "A new verification code has been sent to your email." };
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user || !(await comparePassword(data.password, user.password))) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "approved") {
    throw new Error(`Access denied. Your account status is: ${user.status}`);
  }

  const token = signToken({ userId: user.id, role: user.role });
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  if (!user) throw new Error("User not found");
  return { user };
};

export const deleteMyAccount = async (userId: string) => {
  // Karena schema sudah diset onDelete: SetNull pada Product.createdBy,
  // kita cukup menghapus user-nya saja.
  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "Account deleted successfully" };
};

export const updateMe = async (userId: string, data: { name: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: data.name },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  return { user };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("If the email is registered, a reset code will be sent."); // Silent error to prevent enumeration

  if (user.status !== "approved") throw new Error("Account is not approved.");

  // Check cooldown for forgot password
  if (
    user.resetPasswordCodeExpiresAt &&
    user.resetPasswordCodeExpiresAt > new Date() &&
    user.resetPasswordAttempts < env.VERIFICATION_MAX_ATTEMPTS
  ) {
    throw new Error("Current reset code is still valid. Please wait before requesting a new one.");
  }

  const newCode = generateVerificationCode();
  const codeHash = hashVerificationCode(newCode);
  const expiresAt = new Date(Date.now() + env.VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);

  // Send email first
  await sendPasswordResetEmail(user.email, newCode);

  // Update DB
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordCodeHash: codeHash,
      resetPasswordCodeExpiresAt: expiresAt,
      resetPasswordAttempts: 0,
    },
  });

  const responseData: Record<string, any> = {
    message: "If the email is registered, a reset code will be sent.",
  };

  // [DEV ONLY] Expose reset code in response for easier testing without email.
  // TODO (DEPLOY): Remove the line below before deploying to production.
  if (env.NODE_ENV === "development") {
    responseData.dev_reset_code = newCode;
  }

  return responseData;
};

export const resetPassword = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) throw new Error("Invalid reset code or email");
  
  if (user.resetPasswordAttempts >= env.VERIFICATION_MAX_ATTEMPTS) {
    throw new Error("Maximum reset attempts reached. Please request a new code.");
  }
  
  if (!user.resetPasswordCodeExpiresAt || user.resetPasswordCodeExpiresAt < new Date()) {
    throw new Error("Reset code has expired");
  }
  
  if (!user.resetPasswordCodeHash || !compareVerificationCode(data.code, user.resetPasswordCodeHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordAttempts: { increment: 1 } },
    });
    throw new Error("Invalid reset code");
  }

  const hashedPassword = await hashPassword(data.new_password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordCodeHash: null,
      resetPasswordCodeExpiresAt: null,
      // invalidate existing auth tokens by changing something? Since we use simple JWT, password change doesn't instantly revoke tokens unless we add token versioning.
    },
  });

  return { message: "Password has been reset successfully. You can now login with your new password." };
};
