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
} from '@nestjs/common';
import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import { ModulesService } from '../services/module.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleEntity, ModulePermissionEntity } from '../entity/module.entity';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { ModulePermission, Permission } from '@shared/decorators';

@ModulePermission('rbac')
@Controller('rbac/modules')
@ApiAuthErrors()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Permission('read')
  @Get()
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos')
  findAll() {
    return this.modulesService.findAll();
  }

  @Permission('read')
  @Get(':id')
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos', { single: true })
  @ApiValidationError()
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Permission('write')
  @Post()
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos', { single: true })
  @ApiValidationError()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Permission('write')
  @Patch(':id')
  @ApiEntityResponse(ModuleEntity, 'Modulo Actualizado', { single: true })
  @ApiValidationError()
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Permission('delete')
  @Delete(':id')
  @ApiValidationError()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Modulo Eliminado' })
  async remove(@Param('id') id: string) {
    await this.modulesService.remove(id);
    return;
  }
}
