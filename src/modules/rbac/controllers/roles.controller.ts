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
import {
  SingleRoleResponseEntity,
  RolesResponseEntity,
  RoleCreateResponseEntity,
  RolePermissionResponseEntity,
} from '../entity/role-response.entity';
import { RoleService } from '../services/roles.service';
import { ModulePermission, Permission } from '@shared/decorators';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

@ModulePermission('rbac')
@Controller('rbac/roles')
export class RolesController {
  constructor(private readonly rolesService: RoleService) {}

  @Permission('read')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener los roles del sistema' })
  @ApiEntityResponse(RolesResponseEntity, 'Roles con sus permisos')
  @ApiAuthErrors()
  findAll() {
    return this.rolesService.findAll();
  }

  @Permission('read')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un role del sistema' })
  @ApiEntityResponse(SingleRoleResponseEntity, 'Roles con sus permisos')
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Permission('write')
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Crear un rol del sistema' })
  @ApiEntityResponse(RoleCreateResponseEntity, 'Roles con sus permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Permission('write')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un rol del sistema' })
  @ApiEntityResponse(SingleRoleResponseEntity, 'Roles con sus permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Permission('delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol del sistema' })
  @ApiNoContentResponse({ description: 'Rol Eliminado' })
  @ApiAuthErrors()
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return;
  }

  @Permission('manage')
  @Put(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar Permisos de un rol del sistema' })
  @ApiEntityResponse(RolePermissionResponseEntity, 'Mensaje Ejecucion')
  @ApiValidationError()
  @ApiAuthErrors()
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }
}
