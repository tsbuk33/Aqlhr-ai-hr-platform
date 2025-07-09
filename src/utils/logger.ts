/**
 * Production-grade logging utility for SanadHR
 * Provides structured logging with performance tracking
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, any>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  module?: string;
  userId?: string;
  sessionId?: string;
  duration?: number;
}

class Logger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly isClient = typeof window !== 'undefined';
  
  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context, module, userId, duration } = entry;
    
    let formatted = `[${timestamp}] ${level.toUpperCase()}`;
    
    if (module) formatted += ` [${module}]`;
    if (userId) formatted += ` [user:${userId}]`;
    if (duration !== undefined) formatted += ` [${duration}ms]`;
    
    formatted += ` ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += ` ${JSON.stringify(context)}`;
    }
    
    return formatted;
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    module?: string,
    duration?: number
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      module,
      duration,
      // Add user context if available
      userId: this.isClient ? localStorage.getItem('userId') || undefined : undefined,
      sessionId: this.isClient ? localStorage.getItem('sessionId') || undefined : undefined,
    };
  }

  private write(entry: LogEntry): void {
    const formatted = this.formatMessage(entry);
    
    // In development, use console methods
    if (this.isDevelopment) {
      switch (entry.level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
          console.error(formatted);
          break;
      }
    } else {
      // In production, send to external logging service
      this.sendToLoggingService(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      // Send to Supabase logging or external service
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fallback to console if logging service fails
      console.error('Failed to send log to service:', error);
      console.log(this.formatMessage(entry));
    }
  }

  debug(message: string, context?: LogContext, module?: string): void {
    this.write(this.createEntry('debug', message, context, module));
  }

  info(message: string, context?: LogContext, module?: string): void {
    this.write(this.createEntry('info', message, context, module));
  }

  warn(message: string, context?: LogContext, module?: string): void {
    this.write(this.createEntry('warn', message, context, module));
  }

  error(message: string, context?: LogContext, module?: string): void {
    this.write(this.createEntry('error', message, context, module));
  }

  // Performance tracking
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.info(`Performance: ${label}`, { duration }, 'performance');
      return duration;
    };
  }

  // Government API logging
  logGovernmentAPI(
    api: string,
    endpoint: string,
    status: number,
    duration: number,
    context?: LogContext
  ): void {
    this.info(
      `Government API call: ${api}${endpoint}`,
      {
        api,
        endpoint,
        status,
        duration,
        ...context
      },
      'government-api'
    );
  }

  // Database operation logging
  logDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    context?: LogContext
  ): void {
    this.info(
      `Database operation: ${operation} on ${table}`,
      {
        operation,
        table,
        duration,
        ...context
      },
      'database'
    );
  }

  // Authentication logging
  logAuth(event: string, context?: LogContext): void {
    this.info(
      `Auth event: ${event}`,
      context,
      'authentication'
    );
  }

  // AI/Sync engine logging
  logAISync(
    event: string,
    modules: string[],
    duration?: number,
    context?: LogContext
  ): void {
    this.info(
      `AI Sync: ${event}`,
      {
        modules,
        duration,
        ...context
      },
      'ai-sync'
    );
  }

  // Error with stack trace
  logError(error: Error, context?: LogContext, module?: string): void {
    this.error(
      error.message,
      {
        stack: error.stack,
        name: error.name,
        ...context
      },
      module
    );
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common logging patterns
export const logPerformance = (label: string) => logger.startTimer(label);
export const logGovernmentAPI = logger.logGovernmentAPI.bind(logger);
export const logDatabaseOperation = logger.logDatabaseOperation.bind(logger);
export const logAuth = logger.logAuth.bind(logger);
export const logAISync = logger.logAISync.bind(logger);
export const logError = logger.logError.bind(logger);