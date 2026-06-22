import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication) {
  const config = app.get(ConfigService);
  const isDev = config.get<boolean>('app.isDevelopment');

  if (!isDev) return;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PosCocina API')
    .setDescription('Sistema POS para restaurantes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document);
}
