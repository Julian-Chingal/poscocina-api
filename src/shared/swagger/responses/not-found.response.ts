import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({
    example: 404,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Recurso no encontrado',
    description: 'Descripción del recurso que no fue encontrado',
  })
  message!: string;

  @ApiProperty({
    example: 'Not Found',
    description: 'Tipo de error HTTP',
  })
  error!: string;

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
    description: 'Fecha y hora del error en formato ISO 8601',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/users/25',
    description: 'Ruta del endpoint que generó el error',
  })
  path!: string;
}
