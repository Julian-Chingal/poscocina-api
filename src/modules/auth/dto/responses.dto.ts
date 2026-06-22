import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '@prisma-client/client';

export class UserResponse {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID único del usuario',
  })
  id!: string;

  @ApiProperty({
    example: 'admin@poscocina.com',
    description: 'Correo electrónico del usuario',
  })
  email!: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  name!: string;

  @ApiProperty({
    enum: ['ADMIN', 'MANAGER'],
    description: 'Rol asignado al usuario',
  })
  role!: Role;

  @ApiProperty({
    type: [String],
    example: ['menu:read', 'orders:write'],
    description: 'Lista de permisos del usuario en formato módulo:acción',
  })
  permissions!: string[];
}

export class MetaResponse {
  @ApiProperty({
    example: '2026-06-20T06:22:02.075Z',
    description: 'Fecha y hora de la respuesta en formato ISO 8601',
  })
  timestamp!: string;
}

export class LoginDataResponse {
  @ApiProperty({
    type: UserResponse,
    description: 'Información del usuario autenticado',
  })
  user!: UserResponse;
}

export class LoginResponse {
  @ApiProperty({
    type: LoginDataResponse,
    description: 'Datos del usuario y sesión',
  })
  data!: LoginDataResponse;

  @ApiProperty({
    type: MetaResponse,
    description: 'Metadatos de la respuesta',
  })
  meta!: MetaResponse;
}

export class RefreshResponse {
  @ApiProperty({
    example: 'Tokens renewed',
    description: 'Mensaje de confirmación de renovación de tokens',
  })
  message!: string;
}
