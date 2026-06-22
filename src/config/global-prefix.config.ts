import { INestApplication } from '@nestjs/common';

export function configureGlobalPrefix(app: INestApplication) {
  app.setGlobalPrefix('api/v1');
}
