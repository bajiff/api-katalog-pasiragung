import { prisma } from "../../config/prisma.js";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name }
  });
};

export const updateCategory = async (id: string, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name }
  });
};

export const deleteCategory = async (id: string) => {
  // Check if there are any products related to this category
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (category._count.products > 0) {
    throw new Error("CATEGORY_HAS_PRODUCTS");
  }

  return prisma.category.delete({
    where: { id }
  });
};
