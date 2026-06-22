import { INestApplication } from '@nestjs/common';
import {
  TransformInterceptor,
  TimeoutInterceptor,
} from '../shared/interceptors';

export function configureInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(30000),
  );
}
