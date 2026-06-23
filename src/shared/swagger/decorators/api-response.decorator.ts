import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function ApiEntityResponse<T>(entity: Type<T>, description: string) {
  return applyDecorators(
    ApiOkResponse({
      description: description,
      type: entity,
    }),
  );
}
