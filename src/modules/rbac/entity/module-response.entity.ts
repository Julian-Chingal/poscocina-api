import { ApiProperty } from '@nestjs/swagger';
import { ModulePermissionEntity } from './module.entity';
import { MetaEntity } from './role-response.entity';

export class ModuleResponse {
  @ApiProperty({ type: [ModulePermissionEntity] })
  data!: ModulePermissionEntity[];

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}
