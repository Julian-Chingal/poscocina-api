import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from './permission.entity';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { SingleRoleEntity } from './role.entity';

export class RolePermissionEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  @IsString()
  roleId!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  @IsString()
  permissionId!: string;

  @ApiProperty({ type: [PermissionEntity] })
  @IsArray()
  @IsNotEmpty()
  permission!: PermissionEntity[];
}

export class RolePermissionRoleEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  @IsString()
  roleId!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  @IsString()
  permissionId!: string;

  @ApiProperty({ type: SingleRoleEntity })
  @IsNotEmpty()
  role!: SingleRoleEntity;
}
