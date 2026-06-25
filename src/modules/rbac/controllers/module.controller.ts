import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ModulesService } from '../services/module.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import { ModuleEntity, ModulePermissionEntity } from '../entity/module.entity';

@Controller('rbac/modules')
@ApiAuthErrors()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos')
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos', { single: true })
  @ApiValidationError()
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Post()
  @ApiEntityResponse(ModulePermissionEntity, 'Permisos', { single: true })
  @ApiValidationError()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Patch(':id')
  @ApiEntityResponse(ModuleEntity, 'Modulo Actualizado', { single: true })
  @ApiValidationError()
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete(':id')
  @ApiValidationError()
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
