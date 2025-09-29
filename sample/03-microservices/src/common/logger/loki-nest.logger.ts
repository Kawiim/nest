import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { LokiLogger } from './loki.logger';

@Injectable()
export class LokiNestLogger implements LoggerService {
  private readonly lokiLogger = LokiLogger.getInstance();

  log(message: any, context?: string) {
    if (typeof message === 'object' && message !== null) {
      // If message is an object, log it as structured data
      this.lokiLogger.info(JSON.stringify(message), { context, level: 'log' });
    } else {
      this.lokiLogger.info(message, { context, level: 'log' });
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (typeof message === 'object' && message !== null) {
      this.lokiLogger.error(JSON.stringify(message), { context, trace, level: 'error' });
    } else {
      this.lokiLogger.error(message, { context, trace, level: 'error' });
    }
  }

  warn(message: any, context?: string) {
    if (typeof message === 'object' && message !== null) {
      this.lokiLogger.warn(JSON.stringify(message), { context, level: 'warn' });
    } else {
      this.lokiLogger.warn(message, { context, level: 'warn' });
    }
  }

  debug(message: any, context?: string) {
    if (typeof message === 'object' && message !== null) {
      this.lokiLogger.debug(JSON.stringify(message), { context, level: 'debug' });
    } else {
      this.lokiLogger.debug(message, { context, level: 'debug' });
    }
  }

  verbose(message: any, context?: string) {
    if (typeof message === 'object' && message !== null) {
      this.lokiLogger.verbose(JSON.stringify(message), { context, level: 'verbose' });
    } else {
      this.lokiLogger.verbose(message, { context, level: 'verbose' });
    }
  }

  setLogLevels(levels: LogLevel[]) {
    // Winston doesn't have a direct equivalent, but we can filter in the transport
    this.lokiLogger.level = levels.includes('error') ? 'error' : 
                           levels.includes('warn') ? 'warn' : 
                           levels.includes('log') ? 'info' : 'debug';
  }
}
