import { ApiProperty } from '@nestjs/swagger';
import { MetaEntity } from './role-response.entity';
import {
  PermissionEntity,
  PermissionRolesEntity,
  SinglePermissionEntity,
} from './permission.entity';

export class PermissionResponse {
  @ApiProperty({ type: [PermissionEntity] })
  data!: PermissionEntity[];

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}

export class PermissionByIdResponse {
  @ApiProperty({ type: [PermissionRolesEntity] })
  data!: PermissionRolesEntity[];

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}

export class PermissionByRoleResponse {
  @ApiProperty({ type: [SinglePermissionEntity] })
  data!: SinglePermissionEntity[];

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}
