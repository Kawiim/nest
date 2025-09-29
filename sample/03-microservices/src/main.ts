import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TraceIdInterceptor } from './common/interceptors/trace-id.interceptor';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { LokiNestLogger } from './common/logger/loki-nest.logger';

async function bootstrap() {

  const isDevelopment = process.env.NODE_ENV === 'development';

  console.log('isDevelopment', process.env.NODE_ENV);
  
  // Fallback to console logger if Loki is not available
  const fallbackLogger = new ConsoleLogger({
    json: !isDevelopment,  // JSON format only in production
    colors: true,
    compact: true,
  });

  let logger;
  // Use Loki logger for observability
  if(!isDevelopment) {
    try {
      logger = new LokiNestLogger();
      console.log('✅ Loki logger initialized successfully');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Loki logger, falling back to console logger:', error.message);
      logger = fallbackLogger;
    }
  } else {
    logger = fallbackLogger;
  }
  

  const app = await NestFactory.create(AppModule, { 
    logger 
  });
  
  // Set the global logger instance
  Logger.overrideLogger(logger);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000 },
  });

  await app.startAllMicroservices();
  
  // Apply global interceptors
  const traceIdInterceptor = app.get(TraceIdInterceptor);
  const prometheusInterceptor = app.get(PrometheusInterceptor);
  app.useGlobalInterceptors(traceIdInterceptor, prometheusInterceptor, new LoggingInterceptor());
  
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
