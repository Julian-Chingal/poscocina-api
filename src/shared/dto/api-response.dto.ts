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
  return ApiResponseClass;
}

export function ApiResponseSingle<T>(DataClass: Type<T>) {
  class ApiResponseSingleClass {
    @ApiProperty({ type: DataClass })
    data!: T;

    @ApiProperty({ type: Meta })
    meta!: Meta;
  }
  return ApiResponseSingleClass;
}
