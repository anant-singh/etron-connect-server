import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { serverConfig } from './utils/config';
import { Logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';

const app = express();

// Trust proxy (important for Heroku)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (serverConfig.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (serverConfig.nodeEnv === 'development') {
      Logger.warn('CORS: Allowing origin in development mode', { origin });
      return callback(null, true);
    }
    
    Logger.warn('CORS: Blocked origin', { origin });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: serverConfig.rateLimitWindowMs,
  max: serverConfig.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    Logger.warn('Rate limit exceeded', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      path: req.path 
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (serverConfig.nodeEnv === 'production') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => Logger.info(message.trim())
    }
  }));
} else {
  app.use(morgan('dev'));
}

// Health check endpoint (no auth required)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EtronConnect Server API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
