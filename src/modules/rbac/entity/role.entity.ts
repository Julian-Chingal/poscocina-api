import { ApiProperty } from '@nestjs/swagger';
import { PermissionModuleEntity } from './permission.entity';

export class RoleEntity {
  @ApiProperty({ example: '7a075b43-c6bd-4ee7-878c-136c4d9344cb' })
  id!: string;

  @ApiProperty({ example: 'ADMIN' })
  name!: string;

  @ApiProperty({ example: 'Administrador' })
  label?: string;

  @ApiProperty({ example: 'Administrador con acceso completo' })
  description?: string;
}

export class RolePermissionsEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  roleId!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  permissionId!: string;

  @ApiProperty({ type: PermissionModuleEntity })
  permission!: PermissionModuleEntity;
}

export class RolePermissionEntity extends RoleEntity {
  @ApiProperty({ type: [RolePermissionsEntity] })
  permissions!: RolePermissionsEntity[];
}

export class Message {
  @ApiProperty({ example: 'Permissions updated and sessions invalidated' })
  message!: string;
}
