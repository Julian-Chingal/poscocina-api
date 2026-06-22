import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureSecurity(app: INestApplication) {
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: config.get<string[]>('app.allowedOrigins'),
    credentials: true,
  });
}
