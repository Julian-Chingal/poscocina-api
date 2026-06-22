import { AllExceptionsFilter } from '../shared/filters/http-exception.filter';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export function configureFilters(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
}
