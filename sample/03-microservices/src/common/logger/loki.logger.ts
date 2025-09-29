import { createLogger, format, transports } from 'winston';
const LokiTransport = require('winston-loki');

export class LokiLogger {
  private static instance: any;

  static getInstance() {
    if (!this.instance) {
      this.instance = createLogger({
        level: 'info',
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json()
        ),
        defaultMeta: {
          service: 'nest-microservices',
          environment: process.env.NODE_ENV || 'development',
        },
        transports: [
          // Console transport for development
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.simple()
            )
          }),
          // Loki transport for observability
          new LokiTransport({
            host: process.env.LOKI_HOST || 'http://localhost:3100',
            labels: {
              app: 'nest-microservices',
              environment: process.env.NODE_ENV || 'development'
            },
            json: true,
            onConnectionError: (err) => console.error('Loki connection error:', err),
            timeout: 30000
          })
        ],
        exceptionHandlers: [
          new transports.Console()
        ],
        rejectionHandlers: [
          new transports.Console()
        ]
      });
    }
    return this.instance;
  }
}
