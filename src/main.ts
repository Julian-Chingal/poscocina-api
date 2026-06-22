import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureValidation } from './config/validation.config';
import {
  configureLogger,
  configureSecurity,
  configureGlobalPrefix,
  configureInterceptors,
  configureFilters,
  configureSwagger,
  configureShutdown,
} from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Configuración
  const config = app.get(ConfigService);
  const port = config.get<number>('app.port') ?? 3000;

  configureLogger(app);
  configureSecurity(app);
  configureGlobalPrefix(app);
  configureValidation(app);
  configureInterceptors(app);
  configureFilters(app);
  configureSwagger(app);
  configureShutdown(app);

  await app.listen(port);
  logger.log(`Servidor iniciado en http://localhost:${port}`);
}
bootstrap();
