import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { PermissionCacheService } from 'src/infrastructure/rbac';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionCache: PermissionCacheService,
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: { include: { permission: { include: { module: true } } } },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: { include: { module: true } } } },
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: CreateRoleDto) {
    const exist = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (exist) throw new ConflictException('Role already exists');

    return this.prisma.role.create({
      data,
    });
  }

  async update(id: string, data: UpdateRoleDto) {
    await this.findOne(id);

    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const usersCount = await this.prisma.user.count({
      where: { roleId: id },
    });

    if (usersCount > 0)
      throw new ConflictException('Cannot delete a role assigned to users');

    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    await this.findOne(roleId);

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      await tx.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    });

    await this.permissionCache.invalidateRole(roleId);

    const users = await this.prisma.user.findMany({
      where: { roleId },
      select: { id: true },
    });

    await Promise.all(
      users.map((user) => this.authService.logoutAllSessions(user.id)),
    );

    return {
      message: 'Permissions updated and sessions invalidated',
    };
  }
}
