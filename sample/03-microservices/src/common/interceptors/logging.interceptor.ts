import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, query, body } = request;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    
    const startTime = Date.now();
    
    // Get traceId from request (set by TraceIdInterceptor)
    const traceId = request.traceId || 'no-trace-id';
    
    return next
      .handle()
      .pipe(tap((response) => {
        const duration = Date.now() - startTime;
        const responseLog = {
          type: 'request_complete',
          traceId,
          timestamp: new Date().toISOString(),
          method,
          url,
          controller: className,
          handler: handlerName,
          duration,
          status: 'success',
          clientIp: ip,
          userAgent: headers['user-agent'],
          query: Object.keys(query).length > 0 ? query : undefined,
          bodySize: body ? JSON.stringify(body).length : 0,
          responseSize: response ? JSON.stringify(response).length : 0,
        };
        this.logger.log(responseLog);
      }));
  }

}
