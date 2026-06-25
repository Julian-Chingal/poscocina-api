import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import {
  PermissionEntity,
  PermissionModuleEntity,
  PermissionRolesEntity,
} from '../entity/permission.entity';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { FindPermissionsDto } from '../dto/find-permissions.dto';
import { ModulePermission, Permission } from '@shared/decorators';

@ModulePermission('rbac')
@Controller('rbac/permissions')
@ApiAuthErrors()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission('read')
  @Get()
  @ApiEntityResponse(PermissionModuleEntity, 'Permisos')
  findAll(@Query() query: FindPermissionsDto) {
    return this.permissionService.findAll(query);
  }

  @Permission('read')
  @Get(':id')
  @ApiEntityResponse(PermissionRolesEntity, 'Permisos')
  @ApiValidationError()
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Permission('read')
  @Get('/role/:roleId')
  @ApiEntityResponse(PermissionEntity, 'Permisos')
  @ApiValidationError()
  findByRole(@Param('roleId') roleId: string) {
    return this.permissionService.findByRole(roleId);
  }
}
