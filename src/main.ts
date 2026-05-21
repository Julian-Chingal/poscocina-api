import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
