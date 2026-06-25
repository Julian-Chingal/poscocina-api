import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from './permission.entity';

export class ModuleEntity {
  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  id!: string;

  @ApiProperty({ example: 'pos' })
  name!: string;

  @ApiProperty({ example: 'Punto de Venta' })
  label?: string;
}

export class ModulePermissionEntity extends ModuleEntity {
  @ApiProperty({ type: () => [PermissionEntity] })
  permissions!: PermissionEntity[];
}
