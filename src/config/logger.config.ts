import { INestApplication } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export function configureLogger(app: INestApplication) {
  app.useLogger(app.get(Logger));
}
