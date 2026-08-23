import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Category name must be at least 3 characters").max(255),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "Category name must be at least 3 characters").max(255),
  }),
});
