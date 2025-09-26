import { Request, Response, NextFunction } from 'express';
import { serverConfig } from '../utils/config';
import { Logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  isAuthenticated: boolean;
}

/**
 * Simple API key authentication middleware
 * In production, consider using JWT tokens or OAuth for better security
 */
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authenticatedReq = req as AuthenticatedRequest;
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    Logger.warn('API request without API key', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      path: req.path 
    });
    res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Please provide a valid API key in the x-api-key header'
    });
    return;
  }

  if (apiKey !== serverConfig.apiKey) {
    Logger.warn('API request with invalid API key', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      path: req.path,
      providedKey: apiKey.substring(0, 8) + '...' // Log partial key for debugging
    });
    res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
    return;
  }

  authenticatedReq.isAuthenticated = true;
  next();
};
