import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiProperty({ example: 'Administrador' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @ApiProperty({ example: 'Breve descripcion aqui.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
