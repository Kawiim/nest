import { Injectable } from '@nestjs/common';

@Injectable()
export class TraceIdService {
  private traceId: string;

  setTraceId(traceId: string): void {
    this.traceId = traceId;
  }

  getTraceId(): string {
    return this.traceId;
  }

  generateTraceId(): string {
    this.traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return this.traceId;
  }
}
