import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ForbiddenResponse, UnauthorizedResponse } from '../responses';

export function ApiAuthErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'No autorizado.',
      type: UnauthorizedResponse,
    }),

    ApiForbiddenResponse({
      description: 'Acceso denegado.',
      type: ForbiddenResponse,
    }),
  );
}
