import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

@Injectable()
export class LoggerService {
  private readonly isProduction: boolean;
  private readonly logLevel: LogLevel;
  private readonly consoleEnabled: boolean;
  private readonly nestLogger = new NestLogger(LoggerService.name);

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    this.consoleEnabled = this.configService.get('ENABLE_CONSOLE_LOGS') === 'true';
    
    // Parse log level from environment
    const levelString = this.configService.get('LOG_LEVEL', 'info').toLowerCase();
    this.logLevel = this.parseLogLevel(levelString);
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log if console is explicitly enabled
    if (this.isProduction && !this.consoleEnabled) {
      return level === LogLevel.ERROR; // Only errors in production
    }
    
    // In development, respect log level
    return level <= this.logLevel;
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${context || 'App'}: ${message}`, trace || '');
    }
    // Always log errors to NestJS logger for file logging
    this.nestLogger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${context || 'App'}: ${message}`);
    }
    this.nestLogger.warn(message, context);
  }

  log(message: string, context?: string) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO] ${context || 'App'}: ${message}`);
    }
    this.nestLogger.log(message, context);
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${context || 'App'}: ${message}`);
    }
    this.nestLogger.debug(message, context);
  }

  // Override native console methods in production
  static overrideConsole(configService: ConfigService) {
    const isProduction = configService.get('NODE_ENV') === 'production';
    const consoleEnabled = configService.get('ENABLE_CONSOLE_LOGS') === 'true';

    if (isProduction && !consoleEnabled) {
      // Store original methods
      const originalLog = console.log;
      const originalInfo = console.info;
      const originalWarn = console.warn;
      const originalDebug = console.debug;

      // Override methods
      console.log = () => {};
      console.info = () => {};
      console.warn = () => {};
      console.debug = () => {};
      
      // Keep error logging for critical issues
      // console.error = () => {}; // Uncomment to disable error logs too

      // Provide restore method for testing
      (console as any).restore = () => {
        console.log = originalLog;
        console.info = originalInfo;
        console.warn = originalWarn;
        console.debug = originalDebug;
      };
    }
  }
}