import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Request, Response } from 'express';

/** Shape que NestJS retorna internamente en sus HttpExceptions */
interface NestHttpExceptionBody {
  message: string | string[];
  error?: string;
  statusCode: number;
}

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

    // getResponse() puede devolver string u objeto — lo aplanamos
    const exceptionBody = isHttpException ? exception.getResponse() : null;

    const isProduction500 =
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      process.env.NODE_ENV === 'production';

    let message: string;
    let error: string | undefined;

    if (isProduction500 || !isHttpException) {
      message = 'Error interno del servidor';
    } else if (typeof exceptionBody === 'string') {
      message = exceptionBody;
    } else {
      const body = exceptionBody as NestHttpExceptionBody;
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? 'Error desconocido');
      error = body.error;
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(error && { error }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
