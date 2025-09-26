export interface SmartcarTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string[];
}

export interface SmartcarErrorResponse {
  error: string;
  error_description?: string;
}

export interface TokenExchangeRequest {
  code: string;
  state?: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SmartcarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  apiKey: string;
}
