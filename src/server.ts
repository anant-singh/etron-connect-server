import app from './app';
import { serverConfig } from './utils/config';
import { Logger } from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  Logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  Logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((error) => {
    if (error) {
      Logger.error('Error during server shutdown', error);
      process.exit(1);
    }
    
    Logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    Logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(serverConfig.port, () => {
  Logger.info(`🚀 EtronConnect Server started`, {
    port: serverConfig.port,
    environment: serverConfig.nodeEnv,
    allowedOrigins: serverConfig.allowedOrigins,
    rateLimit: {
      windowMs: serverConfig.rateLimitWindowMs,
      maxRequests: serverConfig.rateLimitMaxRequests
    }
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
