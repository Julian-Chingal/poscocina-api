import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiResponse, ApiResponseSingle } from '@shared/dto/api-response.dto';

export function ApiEntityResponse<T>(
  entity: Type<T>,
  description: string,
  options?: { single: boolean },
) {
  const responseType = options?.single
    ? ApiResponseSingle(entity)
    : ApiResponse(entity);

  return applyDecorators(
    ApiOkResponse({
      description: description,
      type: responseType,
    }),
  );
}
