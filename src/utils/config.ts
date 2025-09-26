import dotenv from 'dotenv';
import { SmartcarConfig, ServerConfig } from '../types';

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'SMARTCAR_CLIENT_ID',
  'SMARTCAR_CLIENT_SECRET',
  'SMARTCAR_REDIRECT_URI'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const smartcarConfig: SmartcarConfig = {
  clientId: process.env.SMARTCAR_CLIENT_ID!,
  clientSecret: process.env.SMARTCAR_CLIENT_SECRET!,
  redirectUri: process.env.SMARTCAR_REDIRECT_URI!,
};

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006'],
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  apiKey: process.env.API_KEY || '', // API key authentication removed
};

export const smartcarEndpoints = {
  tokenUrl: 'https://auth.smartcar.com/oauth/token',
  apiBaseUrl: 'https://api.smartcar.com/v2.0',
} as const;
