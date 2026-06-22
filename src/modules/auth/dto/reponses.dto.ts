import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '@prisma-client/client';

export class UserResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    enum: ['ADMIN', 'MANAGER'],
  })
  role!: Role;

  @ApiProperty({
    type: [String],
  })
  permissions!: string[];
}

export class MetaResponse {
  @ApiProperty({
    example: '2026-06-20T06:22:02.075Z',
  })
  timestamp!: string;
}

export class LoginDataResponse {
  @ApiProperty({
    type: UserResponse,
  })
  user!: UserResponse;
}

export class LoginResponse {
  @ApiProperty({
    type: LoginDataResponse,
  })
  data!: LoginDataResponse;

  @ApiProperty({
    type: MetaResponse,
  })
  meta!: MetaResponse;
}
