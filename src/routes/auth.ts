import { Router } from 'express';
import { exchangeToken, refreshToken, healthCheck, debugConfig } from '../controllers/authController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/auth/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', healthCheck);

/**
 * @route   GET /api/auth/debug
 * @desc    Debug configuration endpoint
 * @access  Public
 */
router.get('/debug', debugConfig);

/**
 * @route   POST /api/auth/exchange
 * @desc    Exchange authorization code for access token
 * @access  Public
 * @body    { code: string, state?: string }
 */
router.post('/exchange', asyncHandler(exchangeToken));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refresh_token: string }
 */
router.post('/refresh', asyncHandler(refreshToken));

export default router;
