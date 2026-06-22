import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Marca el endpoint como protegido con Bearer Auth en Swagger.
 * Solo aplica el candado de seguridad; los errores 401/403 se documentan
 * con @ApiAuthErrors() o @ApiCrudErrors() según corresponda.
 */
export function ApiAuth() {
  return applyDecorators(ApiBearerAuth());
}
