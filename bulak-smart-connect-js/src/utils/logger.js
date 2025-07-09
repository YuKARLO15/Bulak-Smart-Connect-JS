import config from '../config/env.js';

export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor() {
    this.isEnabled = config.LOGGING.ENABLED;
    this.level = this.parseLogLevel(config.LOGGING.LEVEL);
    this.isProduction = config.IS_PRODUCTION;
  }

  parseLogLevel(level) {
    switch (level.toLowerCase()) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  shouldLog(level) {
    if (this.isProduction && !this.isEnabled) {
      return level === LogLevel.ERROR; // Only errors in production
    }
    return level <= this.level;
  }

  error(...args) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('[ERROR]', ...args);
    }
  }

  warn(...args) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('[WARN]', ...args);
    }
  }

  log(...args) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log('[INFO]', ...args);
    }
  }

  info(...args) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info('[INFO]', ...args);
    }
  }

  debug(...args) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug('[DEBUG]', ...args);
    }
  }

  // Group logging for better organization
  group(label) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.shouldLog(LogLevel.INFO)) {
      console.groupEnd();
    }
  }

  // Performance timing
  time(label) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }
}

export const logger = new Logger();
export default logger;