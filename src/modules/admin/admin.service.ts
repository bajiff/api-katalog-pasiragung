import { prisma } from "../../config/prisma.js";

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
  return prisma.user.update({
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
};

export const deleteAdminAccount = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });

  return { message: "Admin account deleted successfully" };
};
