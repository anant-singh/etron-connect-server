import { serverConfig } from './config';

export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  static error(message: string, error?: any): void {
    const errorMeta = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage('error', message, errorMeta));
  }

  static debug(message: string, meta?: any): void {
    if (serverConfig.nodeEnv === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}
