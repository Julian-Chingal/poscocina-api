import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class Meta {
  @ApiProperty({ example: '2026-06-24T14:27:11.010Z' })
  timestamp!: string;
}

export function ApiResponse<T>(DataClass: Type<T>) {
  class ApiResponseClass {
    @ApiProperty({ type: DataClass, isArray: true })
    data!: T[];

    @ApiProperty({ type: Meta })
    meta!: Meta;
  }

  // Sobrescribir el nombre de la clase dinámicamente
  Object.defineProperty(ApiResponseClass, 'name', {
    value: `${DataClass.name}ArrayResponse`,
  });

  return ApiResponseClass;
}

export function ApiResponseSingle<T>(DataClass: Type<T>) {
  class ApiResponseSingleClass {
    @ApiProperty({ type: DataClass })
    data!: T;

    @ApiProperty({ type: Meta })
    meta!: Meta;
  }

  // Sobrescribir el nombre de la clase dinámicamente
  Object.defineProperty(ApiResponseSingleClass, 'name', {
    value: `${DataClass.name}SingleResponse`,
  });

  return ApiResponseSingleClass;
}
