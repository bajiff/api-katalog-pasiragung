import { prisma } from "../../config/prisma.js";
import { generateVerificationCode } from "../../shared/tokenUtils.js";
import { hashVerificationCode } from "../../shared/hashUtils.js";
import { sendVerificationEmail, sendRejectionEmail } from "../../shared/emailService.js";
import { env } from "../../config/env.js";

export const getAllAdmins = async (skip: number, limit: number) => {
  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  return { users, totalItems };
};

export const updateAdminStatus = async (id: string, status: "approved" | "rejected") => {
  if (status === "approved") {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Admin not found");

    const newCode = generateVerificationCode();
    const codeHash = hashVerificationCode(newCode);
    const expiresAt = new Date(Date.now() + env.VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        status: "awaiting_verification",
        verificationCodeHash: codeHash,
        verificationCodeExpiresAt: expiresAt,
        verificationAttempts: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });

    await sendVerificationEmail(updatedUser.email, newCode);
    
    // Kembalikan verification code hanya saat development untuk memudahkan testing
    if (env.NODE_ENV === "development") {
      return {
        ...updatedUser,
        verification_code: newCode
      };
    }

    return updatedUser;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });

  // Kirim email notifikasi penolakan
  await sendRejectionEmail(updatedUser.email);

  return updatedUser;
};

export const deleteAdminAccount = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });

  return { message: "Admin account deleted successfully" };
};
