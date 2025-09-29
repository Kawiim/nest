import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TraceIdInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const traceId = this.extractOrGenerateTraceId(context);

    // Add traceId to the context for use in controllers
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      request.traceId = traceId;
    }

    
    // For RPC messages, we'll store it in a way that can be accessed globally
    if (context.getType() === 'rpc') {
      const data = context.switchToRpc().getData();
      // Store traceId in the data object for access by handlers
      if (data && typeof data === 'object') {
        data._traceId = traceId;
      }
    }
    
    
    return next.handle();
  }

  private extractOrGenerateTraceId(context: ExecutionContext): string {
    // For HTTP requests
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      // Check for existing traceId in headers first
      const existingTraceId = request.headers['x-trace-id'];
      if (existingTraceId) {
        return existingTraceId;
      }
      // If no header, check if traceId was already set (for subsequent calls)
      if (request.traceId) {
        return request.traceId;
      }
    }
    
    // For RPC messages
    if (context.getType() === 'rpc') {
      const data = context.switchToRpc().getData();
      if (data && typeof data === 'object' && data.traceId) {
        return data.traceId;
      }
    }
    
    // Generate new traceId if none exists
    return this.generateTraceId();
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
