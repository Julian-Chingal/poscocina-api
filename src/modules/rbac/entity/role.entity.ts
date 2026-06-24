import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolePermissionEntity } from './role-permission.entity';

export class SingleRoleEntity {
  @ApiProperty({ example: '7a075b43-c6bd-4ee7-878c-136c4d9344cb' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Administrador' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'Administrador con acceso completo' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class RoleEntity extends SingleRoleEntity {
  @ApiProperty({ type: RolePermissionEntity })
  @IsNotEmpty()
  permissions!: RolePermissionEntity;
}
