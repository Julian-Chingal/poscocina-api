import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { FindPermissionsDto } from '../dto/find-permissions.dto';
import {
  PermissionByIdResponse,
  PermissionByRoleResponse,
  PermissionResponse,
} from '../entity/permission-response.enityt';

@Controller('rbac/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'listar los permisos del sistema' })
  @ApiEntityResponse(PermissionResponse, 'Permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  findAll(@Query() query: FindPermissionsDto) {
    return this.permissionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso del sistema' })
  @ApiEntityResponse(PermissionByIdResponse, 'Permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Get('/role/:roleId')
  @ApiOperation({ summary: 'Obtener los permisos por rol' })
  @ApiEntityResponse(PermissionByRoleResponse, 'Permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  findByRole(@Param('roleId') roleId: string) {
    return this.permissionService.findByRole(roleId);
  }
}
