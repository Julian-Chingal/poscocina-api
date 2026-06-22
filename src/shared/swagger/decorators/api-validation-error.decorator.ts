import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ValidationErrorResponse } from '../responses';

export function ApiValidationError() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Error de validación.',
      type: ValidationErrorResponse,
    }),
  );
}
