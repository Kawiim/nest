import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusService } from '../services/prometheus.service';
import { Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.prometheusService.getMetrics();
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(metrics);
  }

  @Get('json')
  async getMetricsAsJSON() {
    return await this.prometheusService.getMetricsAsJSON();
  }
}
