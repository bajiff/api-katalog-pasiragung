import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

export const getAllProducts = async (
  skip: number,
  limit: number,
  categoryId?: string,
  search?: string
) => {
  const where: Prisma.ProductWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return { products, totalItems };
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true }
      },
      creator: {
        select: { id: true, name: true }
      }
    }
  });
};

export const createProduct = async (data: Prisma.ProductUncheckedCreateInput) => {
  return prisma.product.create({
    data
  });
};

export const updateProduct = async (id: string, data: Prisma.ProductUncheckedUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id }
  });
};
