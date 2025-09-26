import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  // Log the error
  Logger.error('Request error', {
    message: error.message,
    stack: error.stack,
    statusCode,
    isOperational,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response: ApiResponse = {
    success: false,
    error: isDevelopment ? error.message : 'Internal server error',
    message: statusCode === 500 
      ? 'Something went wrong on our end' 
      : error.message
  };

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    (response as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: AppError = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
