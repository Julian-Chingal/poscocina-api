import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ValidationErrorResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
} from '../responses';

export function ApiCrudErrors() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Solicitud inválida.',
      type: ValidationErrorResponse,
    }),

    ApiUnauthorizedResponse({
      description: 'No autorizado.',
      type: UnauthorizedResponse,
    }),

    ApiForbiddenResponse({
      description: 'Acceso denegado.',
      type: ForbiddenResponse,
    }),

    ApiNotFoundResponse({
      description: 'Recurso no encontrado.',
      type: NotFoundResponse,
    }),

    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor.',
      type: InternalServerErrorResponse,
    }),
  );
}
