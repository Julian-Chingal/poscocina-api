import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionAction } from '@prisma-client/client';
import { PrismaService } from '@core/prisma/prisma.service';

import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.module.findMany({
      include: {
        permissions: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async create(dto: CreateModuleDto) {
    const exists = await this.prisma.module.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (exists) {
      throw new ConflictException('Module already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      const module = await tx.module.create({
        data: {
          name: dto.name.trim().toLowerCase(),
          label: dto.label.trim(),
        },
      });

      await tx.permission.createMany({
        data: [
          {
            moduleId: module.id,
            action: PermissionAction.read,
            label: `${module.label} Read`,
          },
          {
            moduleId: module.id,
            action: PermissionAction.write,
            label: `${module.label} Write`,
          },
          {
            moduleId: module.id,
            action: PermissionAction.delete,
            label: `${module.label} Delete`,
          },
          {
            moduleId: module.id,
            action: PermissionAction.manage,
            label: `${module.label} Manage`,
          },
        ],
      });

      return tx.module.findUnique({
        where: {
          id: module.id,
        },
        include: {
          permissions: true,
        },
      });
    });
  }

  async update(id: string, dto: UpdateModuleDto) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        ...(dto.name && {
          name: dto.name.trim().toLowerCase(),
        }),
        ...(dto.label && {
          label: dto.label.trim(),
        }),
      },
    });
  }

  async remove(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      select: {
        id: true,
        permissions: {
          select: {
            _count: {
              select: { roles: true },
            },
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const hasAssignedRoles = module.permissions.some(
      (permission) => permission._count.roles > 0,
    );

    if (hasAssignedRoles)
      throw new ConflictException(
        'Cannot delete a module with assigned permissions',
      );

    await this.prisma.module.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Module deleted successfully',
    };
  }
}
