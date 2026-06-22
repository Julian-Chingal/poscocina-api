import { ApiProperty } from '@nestjs/swagger';

export class ValidationFieldErrorResponse {
  @ApiProperty({
    example: 'email',
    description: 'Nombre del campo que falló la validación',
  })
  field!: string;

  @ApiProperty({
    example: 'El correo electrónico es inválido',
    description: 'Descripción del error de validación para el campo',
  })
  message!: string;
}

export class ValidationErrorResponse {
  @ApiProperty({
    example: 400,
    description: 'Código HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Validación fallida',
    description: 'Mensaje general del error',
  })
  message!: string;

  @ApiProperty({
    type: [ValidationFieldErrorResponse],
    description: 'Lista de errores de validación por campo',
  })
  errors!: ValidationFieldErrorResponse[];

  @ApiProperty({
    example: '2026-06-22T05:30:10.000Z',
    description: 'Fecha y hora del error en formato ISO 8601',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/auth/login',
    description: 'Ruta del endpoint que generó el error',
  })
  path!: string;
}
