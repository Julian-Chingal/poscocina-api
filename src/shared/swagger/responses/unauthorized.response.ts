import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty({
    example: 401,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Invalid email or password',
    description: 'Descripción del error de autenticación',
  })
  message!: string;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Tipo de error HTTP',
  })
  error?: string;

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
    description: 'Fecha y hora del error en formato ISO 8601',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/auth/login',
    description: 'Ruta del endpoint que generó el error',
  })
  path!: string;
}
