import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.getResponse()
      : 'Error interno del servidor';

    if (!isHttpException) {
      this.logger.error(
        {
          err: exception,
          path: request.url,
          method: request.method,
        },
        'Excepción no controlada',
      );
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message:
        status === 500 && process.env.NODE_ENV === 'production'
          ? 'Error interno del servidor'
          : message,
    });
  }
}
