import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindPermissionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  moduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  roleId?: string;
}
