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
import { ApiOperation } from '@nestjs/swagger';
import {
  ApiAuthErrors,
  ApiEntityResponse,
  ApiValidationError,
} from '@shared/swagger/decorators';
import { ModuleResponse } from '../entity/module-response.entity';

@Controller('rbac/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'listar los permisos del sistema' })
  @ApiEntityResponse(ModuleResponse, 'Permisos')
  @ApiValidationError()
  @ApiAuthErrors()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
