import { Response } from "express";

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const successResponse = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message: string, statusCode = 400, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const paginatedResponse = <T>(
  res: Response, 
  data: T[], 
  totalItems: number, 
  page: number, 
  limit: number, 
  message?: string
) => {
  const totalPages = Math.ceil(totalItems / limit);
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };

  return res.status(200).json(message ? { message, ...response } : response);
};
