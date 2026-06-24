import { ApiProperty } from '@nestjs/swagger';
import { ModuleEntity } from './module.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolePermissionRoleEntity } from './role-permission.entity';

export class SinglePermissionEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  @IsString()
  moduleId!: string;

  @ApiProperty({ example: 'read' })
  @IsString()
  action!: string;

  @ApiProperty({ example: 'Ver órdenes y comandas' })
  @IsOptional()
  @IsString()
  label?: string;
}

export class PermissionEntity extends SinglePermissionEntity {
  @ApiProperty({ type: ModuleEntity })
  @IsNotEmpty()
  module!: ModuleEntity;
}

export class PermissionRolesEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  @IsString()
  moduleId!: string;

  @ApiProperty({ example: 'read' })
  @IsString()
  action!: string;

  @ApiProperty({ example: 'Ver órdenes y comandas' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ type: ModuleEntity })
  @IsNotEmpty()
  module!: ModuleEntity;

  @ApiProperty({ type: [RolePermissionRoleEntity] })
  @IsNotEmpty()
  roles!: RolePermissionRoleEntity[];
}
