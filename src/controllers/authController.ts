import { Request, Response } from 'express';
import { smartcarConfig, smartcarEndpoints } from '../utils/config';
import { Logger } from '../utils/logger';
import { 
  TokenExchangeRequest, 
  TokenRefreshRequest, 
  SmartcarTokenResponse, 
  SmartcarErrorResponse,
  ApiResponse 
} from '../types';

/**
 * Exchange authorization code for access token
 */
export const exchangeToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state }: TokenExchangeRequest = req.body;

    if (!code) {
      res.status(400).json({
        success: false,
        error: 'Missing authorization code',
        message: 'Authorization code is required'
      });
      return;
    }

    Logger.info('Token exchange request', { 
      hasCode: !!code, 
      hasState: !!state,
      ip: req.ip 
    });

    // Prepare token exchange request
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: smartcarConfig.redirectUri,
    });

    // Create Basic Auth header
    const credentials = Buffer.from(
      `${smartcarConfig.clientId}:${smartcarConfig.clientSecret}`
    ).toString('base64');

    // Exchange code for token
    const response = await fetch(smartcarEndpoints.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'EtronConnect-Server/1.0.0',
      },
      body: tokenRequestBody,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as SmartcarErrorResponse;
      Logger.error('Smartcar token exchange failed', {
        status: response.status,
        error: errorData.error,
        description: errorData.error_description
      });

      res.status(400).json({
        success: false,
        error: 'Token exchange failed',
        message: errorData.error_description || errorData.error || 'Unknown error'
      });
      return;
    }

    const tokenData = responseData as SmartcarTokenResponse;
    
    Logger.info('Token exchange successful', { 
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      scopes: tokenData.scope
    });

    // Return token data to client
    const apiResponse: ApiResponse<SmartcarTokenResponse> = {
      success: true,
      data: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      },
      message: 'Token exchange successful'
    };

    res.json(apiResponse);

  } catch (error) {
    Logger.error('Token exchange error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to exchange authorization code'
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token }: TokenRefreshRequest = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Missing refresh token',
        message: 'Refresh token is required'
      });
      return;
    }

    Logger.info('Token refresh request', { ip: req.ip });

    // Prepare token refresh request
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    });

    // Create Basic Auth header
    const credentials = Buffer.from(
      `${smartcarConfig.clientId}:${smartcarConfig.clientSecret}`
    ).toString('base64');

    // Refresh token
    const response = await fetch(smartcarEndpoints.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'EtronConnect-Server/1.0.0',
      },
      body: tokenRequestBody,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as SmartcarErrorResponse;
      Logger.error('Smartcar token refresh failed', {
        status: response.status,
        error: errorData.error,
        description: errorData.error_description
      });

      res.status(400).json({
        success: false,
        error: 'Token refresh failed',
        message: errorData.error_description || errorData.error || 'Unknown error'
      });
      return;
    }

    const tokenData = responseData as SmartcarTokenResponse;
    
    Logger.info('Token refresh successful', { 
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in
    });

    // Return refreshed token data to client
    const apiResponse: ApiResponse<SmartcarTokenResponse> = {
      success: true,
      data: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || refresh_token, // Keep old refresh token if new one not provided
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      },
      message: 'Token refresh successful'
    };

    res.json(apiResponse);

  } catch (error) {
    Logger.error('Token refresh error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to refresh access token'
    });
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = (req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'EtronConnect Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};
