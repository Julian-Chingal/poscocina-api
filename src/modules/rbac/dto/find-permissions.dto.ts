import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindPermissionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roleId?: string;
}
