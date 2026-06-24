import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'pos' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_-]+$/)
  name!: string;

  @ApiProperty({ example: 'Sistema pos' })
  @IsString()
  @IsNotEmpty()
  label!: string;
}
