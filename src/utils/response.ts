import type { Response } from 'express';
import type { PaginationMeta, ResponseMeta } from '../types/common';

const createMeta = (): ResponseMeta => ({
  timestamp: new Date().toISOString()
});

export const sendSuccess = <T = unknown>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
    meta: createMeta()
  });
};

export const sendSuccessPagination = <T = unknown>(
  res: Response,
  message: string,
  data: T,
  pagination: PaginationMeta,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      ...createMeta(),
      pagination
    }
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    meta: createMeta()
  });
};