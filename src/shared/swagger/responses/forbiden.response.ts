import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponse {
  @ApiProperty({
    example: 403,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Acceso denegado',
    description: 'Descripción del error de autorización',
  })
  message!: string;

  @ApiProperty({
    example: 'Forbidden',
    description: 'Tipo de error HTTP',
  })
  error!: string;

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
    description: 'Fecha y hora del error en formato ISO 8601',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/orders',
    description: 'Ruta del endpoint que generó el error',
  })
  path!: string;
}
