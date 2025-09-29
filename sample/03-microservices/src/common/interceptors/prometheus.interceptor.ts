import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrometheusService } from '../services/prometheus.service';
import { Request, Response } from 'express';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PrometheusInterceptor.name);

  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    const startTime = Date.now();
    const method = request.method;
    const route = request.route?.path || request.url;

    // Increment active connections
    this.prometheusService.incrementActiveConnections(className);

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Record successful request metrics
        this.prometheusService.recordHttpRequest(
          method,
          route,
          statusCode,
          duration,
          className,
          handlerName
        );

        // Record business operation metrics
        this.prometheusService.recordBusinessOperation(
          `${className}.${handlerName}`,
          className,
          'success'
        );

        // Decrement active connections
        this.prometheusService.decrementActiveConnections(className);

        this.logger.debug(`Recorded metrics for ${method} ${route} - ${statusCode} (${duration}ms)`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Record error metrics
        this.prometheusService.recordHttpRequest(
          method,
          route,
          statusCode,
          duration,
          className,
          handlerName
        );

        // Record business operation error
        this.prometheusService.recordBusinessOperation(
          `${className}.${handlerName}`,
          className,
          'error'
        );

        // Decrement active connections
        this.prometheusService.decrementActiveConnections(className);

        this.logger.error(`Recorded error metrics for ${method} ${route} - ${statusCode} (${duration}ms)`);
        throw error;
      })
    );
  }
}
