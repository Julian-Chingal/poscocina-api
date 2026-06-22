import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Request, Response } from 'express';

interface HttpExceptionResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  errors?: unknown[];
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  errors?: unknown[];
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const path = request.originalUrl ?? request.url;

    if (!isHttpException || status >= 500) {
      this.logger.error(
        {
          err: exception,
          method: request.method,
          path,
          stack: exception instanceof Error ? exception.stack : undefined,
          cause: exception instanceof Error ? exception.cause : undefined,
        },
        'Request failed',
      );
    }

    const isProduction500 =
      status === 500 && process.env.NODE_ENV === 'production';

    let message = 'Error desconocido';
    let error: string | undefined;
    let errors: unknown[] | undefined;

    if (isProduction500) {
      message = 'Error interno del servidor';
    } else if (isHttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const body = exceptionResponse as HttpExceptionResponseBody;

        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : (body.message ?? 'Error desconocido');

        error = body.error;
        errors = body.errors;
      }
    } else if (exception instanceof Error) {
      message = exception.message || 'Error interno del servidor';
    } else {
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      path,
      ...(error ? { error } : {}),
      ...(errors?.length ? { errors } : {}),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
