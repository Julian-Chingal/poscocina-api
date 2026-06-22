import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({
    example: 400,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Solicitud inválida',
    description: 'Descripción del error de solicitud',
  })
  message!: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Tipo de error HTTP',
  })
  error!: string;

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
    description: 'Fecha y hora del error en formato ISO 8601',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/users',
    description: 'Ruta del endpoint que generó el error',
  })
  path!: string;
}
