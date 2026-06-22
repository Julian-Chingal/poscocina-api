import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiProperty({
    example: 500,
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Error interno del servidor',
  })
  message!: string;

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/orders',
  })
  path!: string;
}
