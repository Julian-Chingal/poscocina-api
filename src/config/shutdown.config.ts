import { INestApplication } from '@nestjs/common';

export function configureShutdown(app: INestApplication) {
  app.enableShutdownHooks();
}
