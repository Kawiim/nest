import { Global, Module } from '@nestjs/common';
import { TraceIdService } from './services/trace-id.service';
import { TraceIdInterceptor } from './interceptors/trace-id.interceptor';
import { PrometheusService } from './services/prometheus.service';
import { PrometheusInterceptor } from './interceptors/prometheus.interceptor';
import { MetricsController } from './controllers/metrics.controller';

@Global()
@Module({
  controllers: [MetricsController],
  providers: [TraceIdService, TraceIdInterceptor, PrometheusService, PrometheusInterceptor],
  exports: [TraceIdService, TraceIdInterceptor, PrometheusService, PrometheusInterceptor],
})
export class CommonModule {}
