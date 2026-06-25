import { ApiProperty } from '@nestjs/swagger';
import { ModuleEntity } from './module.entity';
import { RolePermissionRoleEntity } from './role-permission.entity';

export class PermissionEntity {
  @ApiProperty({ example: 'a69707a0-c0b9-412e-9695-00424c97ef65' })
  id!: string;

  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  moduleId!: string;

  @ApiProperty({ example: 'read' })
  action!: string;

  @ApiProperty({ example: 'Ver órdenes y comandas' })
  label?: string;
}

export class PermissionModuleEntity extends PermissionEntity {
  @ApiProperty({ type: () => ModuleEntity })
  module!: ModuleEntity;
}

export class PermissionRolesEntity extends PermissionEntity {
  @ApiProperty({ type: () => ModuleEntity })
  module!: ModuleEntity;

  @ApiProperty({ type: () => [RolePermissionRoleEntity] })
  roles!: RolePermissionRoleEntity[];
}
