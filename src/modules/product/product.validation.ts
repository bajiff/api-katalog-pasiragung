import { z } from "zod";

const stringToNumber = z.preprocess((val) => {
  if (typeof val === "string") return parseFloat(val);
  return val;
}, z.number().min(0));

const jsonStringToArray = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}, z.array(z.string()).or(z.array(z.object({}))));

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().uuid("Invalid category ID"),
    whatsappNumber: z.string().min(9, "Whatsapp number must be at least 9 characters"),
    description: z.string().min(1, "Description is required"),
    ownerName: z.string().min(1, "Owner name is required"),
    stockStatus: z.enum(["tersedia", "belum_tersedia"]),
    productionSystem: z.enum(["pre_order", "ready_stock"]),
    netWeight: z.string().min(1, "Net weight is required"),
    price: stringToNumber,
    flavorVariants: jsonStringToArray,
    composition: z.string().min(1, "Composition is required"),
    nibNumber: z.string().optional(),
    halalCertificateNumber: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    categoryId: z.string().uuid("Invalid category ID").optional(),
    whatsappNumber: z.string().min(9, "Whatsapp number must be at least 9 characters").optional(),
    description: z.string().min(1, "Description is required").optional(),
    ownerName: z.string().min(1, "Owner name is required").optional(),
    stockStatus: z.enum(["tersedia", "belum_tersedia"]).optional(),
    productionSystem: z.enum(["pre_order", "ready_stock"]).optional(),
    netWeight: z.string().min(1, "Net weight is required").optional(),
    price: stringToNumber.optional(),
    flavorVariants: jsonStringToArray.optional(),
    composition: z.string().min(1, "Composition is required").optional(),
    nibNumber: z.string().optional(),
    halalCertificateNumber: z.string().optional(),
  }),
});
