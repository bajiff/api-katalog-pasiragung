import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service.js";
import { successResponse, errorResponse } from "../../shared/apiResponse.js";
import { createCategorySchema, updateCategorySchema } from "./category.validation.js";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, categories, "Successfully fetched categories");
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }
    return successResponse(res, category, "Successfully fetched category");
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategorySchema.parse(req);
    const category = await categoryService.createCategory(validatedData.body.name);
    return successResponse(res, category, "Category created successfully", 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return errorResponse(res, "Category with this name already exists", 400);
    }
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req);
    const category = await categoryService.updateCategory(id, validatedData.body.name);
    return successResponse(res, category, "Category updated successfully");
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse(res, "Category not found", 404);
    }
    if (error.code === "P2002") {
      return errorResponse(res, "Category with this name already exists", 400);
    }
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return successResponse(res, null, "Category deleted successfully");
  } catch (error: any) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return errorResponse(res, "Category not found", 404);
    }
    if (error.message === "CATEGORY_HAS_PRODUCTS") {
      return errorResponse(res, "Cannot delete category because it has products associated with it", 400);
    }
    next(error);
  }
};
