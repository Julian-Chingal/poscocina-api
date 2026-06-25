import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindPermissionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { each: true })
  moduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { each: true })
  roleId?: string;
}
