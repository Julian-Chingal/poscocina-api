import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SinglePermissionEntity } from './permission.entity';

export class ModuleEntity {
  @ApiProperty({ example: 'b3645495-cc90-4b4b-b593-bd99466e5010' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'pos' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Punto de Venta' })
  @IsOptional()
  @IsString()
  label?: string;
}

export class ModulePermissionEntity extends ModuleEntity {
  @ApiProperty({ type: [SinglePermissionEntity] })
  permissions!: SinglePermissionEntity[];
}
