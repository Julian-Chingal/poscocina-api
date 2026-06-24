import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity, SingleRoleEntity } from './role.entity';
import { IsString } from 'class-validator';

export class MetaEntity {
  @ApiProperty({ example: '2026-06-24T14:27:11.010Z' })
  @IsString()
  timestamp!: string;
}

export class Message {
  @ApiProperty({ example: 'Permissions updated and sessions invalidated' })
  @IsString()
  message!: string;
}

export class RolesResponseEntity {
  @ApiProperty({ type: [RoleEntity] })
  data!: RoleEntity[];

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}

export class SingleRoleResponseEntity {
  @ApiProperty({ type: RoleEntity })
  data!: RoleEntity;

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}

export class RoleCreateResponseEntity {
  @ApiProperty({ type: SingleRoleEntity })
  data!: SingleRoleEntity;

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}

export class RolePermissionResponseEntity {
  @ApiProperty({ type: Message })
  data!: Message;

  @ApiProperty({ type: MetaEntity })
  meta!: MetaEntity;
}
