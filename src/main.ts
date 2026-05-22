import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // Configuración
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  const isDev = config.get<boolean>('app.isDevelopment', true);

  // Seguridad
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: config.get<string[]>('app.allowedOrigins'),
    credentials: true,
  });

  // Prefijo global
  app.setGlobalPrefix('api/v1');

  // Pipes, Filtros
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(30_000),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));

  // Swagger
  if (isDev) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PosCocina API')
      .setDescription('Sistema POS para restaurantes')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.enableShutdownHooks();
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Servidor iniciado en el puerto ${port}`);
  if (isDev) {
    logger.log(`Swagger disponible en http://localhost:${port}/api/docs`);
  }
}
bootstrap();
