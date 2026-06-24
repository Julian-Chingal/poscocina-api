import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { FindPermissionsDto } from '../dto/find-permissions.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: FindPermissionsDto) {
    return this.prisma.permission.findMany({
      where: {
        moduleId: query?.moduleId,
      },
      include: {
        module: true,
      },
      orderBy: [
        {
          module: {
            name: 'asc',
          },
        },
        {
          action: 'asc',
        },
      ],
    });
  }

  async findByRole(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                module: true,
              },
            },
          },
        },
      },
    });

    return (
      role?.permissions.map(({ permission }) => ({
        id: permission.id,
        module: permission.module.name,
        action: permission.action,
        label: permission.label,
      })) ?? []
    );
  }

  async findOne(id: string) {
    return this.prisma.permission.findUnique({
      where: {
        id,
      },
      include: {
        module: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
