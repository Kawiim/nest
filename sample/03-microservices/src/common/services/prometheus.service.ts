import { Injectable, OnModuleInit } from '@nestjs/common';
import { register, Counter, Histogram, Gauge, Summary } from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpRequestTotal: Counter<string>;
  private readonly httpRequestErrors: Counter<string>;
  private readonly activeConnections: Gauge<string>;
  private readonly responseTimeSummary: Summary<string>;
  private readonly businessMetrics: Counter<string>;

  constructor() {
    // Clear any existing metrics
    register.clear();

    // HTTP Request Duration Histogram
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'controller', 'handler'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });

    // HTTP Request Total Counter
    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'controller', 'handler'],
    });

    // HTTP Request Errors Counter
    this.httpRequestErrors = new Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code', 'controller', 'handler', 'error_type'],
    });

    // Active Connections Gauge
    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      labelNames: ['service'],
    });

    // Response Time Summary
    this.responseTimeSummary = new Summary({
      name: 'http_response_time_summary_seconds',
      help: 'Summary of HTTP response times',
      labelNames: ['method', 'route', 'controller'],
      percentiles: [0.5, 0.9, 0.95, 0.99],
    });

    // Business Metrics Counter
    this.businessMetrics = new Counter({
      name: 'business_operations_total',
      help: 'Total number of business operations',
      labelNames: ['operation', 'service', 'status'],
    });
  }

  onModuleInit() {
    // Register default metrics (CPU, memory, etc.)
    register.setDefaultLabels({
      app: 'nest-microservices',
      version: '1.0.0',
    });
  }

  // HTTP Metrics
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number, controller: string, handler: string) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString(), controller, handler)
      .observe(duration / 1000); // Convert ms to seconds

    this.httpRequestTotal
      .labels(method, route, statusCode.toString(), controller, handler)
      .inc();

    this.responseTimeSummary
      .labels(method, route, controller)
      .observe(duration / 1000);

    // Record errors
    if (statusCode >= 400) {
      this.httpRequestErrors
        .labels(method, route, statusCode.toString(), controller, handler, this.getErrorType(statusCode))
        .inc();
    }
  }

  // Connection Metrics
  incrementActiveConnections(service: string = 'default') {
    this.activeConnections.labels(service).inc();
  }

  decrementActiveConnections(service: string = 'default') {
    this.activeConnections.labels(service).dec();
  }

  // Business Metrics
  recordBusinessOperation(operation: string, service: string, status: 'success' | 'error') {
    this.businessMetrics.labels(operation, service, status).inc();
  }

  // Microservice Communication Metrics
  recordMicroserviceCall(service: string, method: string, duration: number, status: 'success' | 'error') {
    this.businessMetrics.labels(`microservice_call_${method}`, service, status).inc();
  }

  // Get metrics in Prometheus format
  async getMetrics(): Promise<string> {
    return await register.metrics();
  }

  // Get metrics as JSON
  async getMetricsAsJSON() {
    return await register.getMetricsAsJSON();
  }

  private getErrorType(statusCode: number): string {
    if (statusCode >= 500) return 'server_error';
    if (statusCode >= 400) return 'client_error';
    return 'unknown';
  }
}
