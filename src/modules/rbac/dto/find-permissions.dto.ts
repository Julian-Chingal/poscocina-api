import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindPermissionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID('4')
  moduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  @IsString()
  roleId?: string;
}
