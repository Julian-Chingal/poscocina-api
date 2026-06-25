import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import { RoleService } from '../services/roles.service';
import { ModulePermission, Permission } from '@shared/decorators';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { ApiNoContentResponse } from '@nestjs/swagger';
import {
  Message,
  RoleEntity,
  RolePermissionEntity,
} from '../entity/role.entity';

@ModulePermission('rbac')
@Controller('rbac/roles')
@ApiAuthErrors()
export class RolesController {
  constructor(private readonly rolesService: RoleService) {}

  @Permission('read')
  @Get()
  @ApiEntityResponse(RolePermissionEntity, 'Roles con sus permisos')
  findAll() {
    return this.rolesService.findAll();
  }

  @Permission('read')
  @Get(':id')
  @ApiEntityResponse(RolePermissionEntity, 'Roles con sus permisos', {
    single: true,
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Permission('write')
  @Post()
  @ApiEntityResponse(RoleEntity, 'Roles con sus permisos', {
    single: true,
  })
  @ApiValidationError()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Permission('write')
  @Patch(':id')
  @ApiEntityResponse(RolePermissionEntity, 'Roles con sus permisos', {
    single: true,
  })
  @ApiValidationError()
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Permission('delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Rol Eliminado' })
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return;
  }

  @Permission('manage')
  @Put(':id/permissions')
  @ApiEntityResponse(Message, 'Mensaje Ejecucion')
  @ApiValidationError()
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }
}
