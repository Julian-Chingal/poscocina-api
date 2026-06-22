import { INestApplication } from '@nestjs/common';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { TimeoutInterceptor } from '../shared/interceptors/timeout.interceptor';

export function configureInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(30000),
  );
}
