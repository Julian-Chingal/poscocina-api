import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponse {
  @ApiProperty({
    example: 409,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'El recurso ya existe',
    description: 'Descripción del conflicto',
  })
  message!: string;

  @ApiProperty({
    example: 'Conflict',
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
