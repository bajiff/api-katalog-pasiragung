import { Request, Response, NextFunction } from "express";
import * as productService from "./product.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../shared/apiResponse.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";
import { getPaginationOptions } from "../../shared/paginationUtils.js";
import { cloudinary } from "../../config/cloudinary.js";

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req.query.page, req.query.limit);
    const categoryId = req.query.categoryId as string | undefined;
    const search = req.query.search as string | undefined;

    const { products, totalItems } = await productService.getAllProducts(skip, limit, categoryId, search);
    return paginatedResponse(res, products, totalItems, page, limit, "Successfully fetched products");
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    return successResponse(res, product, "Successfully fetched product");
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createProductSchema.parse(req);
    const userId = req.user!.userId;
    
    if (!req.file) {
      return errorResponse(res, "Product image is required", 400);
    }

    let imageUrl = "";
    let imagePublicId = "";
    
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "ekatalog/products");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return errorResponse(res, "Failed to upload image to Cloudinary", 500);
    }

    const productData = {
      ...validatedData.body,
      imageUrl,
      imagePublicId,
      createdBy: userId
    };

    const product = await productService.createProduct(productData);
    return successResponse(res, product, "Product created successfully", 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return errorResponse(res, "Invalid category ID or foreign key constraint failed", 400);
    }
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req);
    
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      return errorResponse(res, "Product not found", 404);
    }

    const productData: any = { ...validatedData.body };

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, "ekatalog/products");
        productData.imageUrl = uploadResult.secure_url;
        productData.imagePublicId = uploadResult.public_id;
        
        // Optionally delete old image from Cloudinary
        if (existingProduct.imagePublicId) {
          cloudinary.uploader.destroy(existingProduct.imagePublicId).catch(console.error);
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return errorResponse(res, "Failed to upload image to Cloudinary", 500);
      }
    }

    const product = await productService.updateProduct(id, productData);
    return successResponse(res, product, "Product updated successfully");
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse(res, "Product not found", 404);
    }
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      return errorResponse(res, "Product not found", 404);
    }
    
    await productService.deleteProduct(id);
    
    // Delete image from Cloudinary
    if (existingProduct.imagePublicId) {
      cloudinary.uploader.destroy(existingProduct.imagePublicId).catch(console.error);
    }
    
    return successResponse(res, null, "Product deleted successfully");
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse(res, "Product not found", 404);
    }
    next(error);
  }
};
