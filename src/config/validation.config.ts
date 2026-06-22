import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

export function configureValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,

      exceptionFactory(errors) {
        return new BadRequestException({
          message: 'Validación fallida',
          errors: errors.flatMap((error) =>
            Object.values(error.constraints ?? {}).map((message) => ({
              field: error.property,
              message,
            })),
          ),
        });
      },
    }),
  );
}
