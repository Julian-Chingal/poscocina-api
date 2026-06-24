import { PrismaService } from '@core/prisma/prisma.service';
import { RedisService } from '@core/redis/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionCacheService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private key(roleId: string) {
    return `role:${roleId}:permissions`;
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const cacheKey = this.key(roleId);

    // Redis lookup
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as string[];

    // DB fallback
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: {
              include: { module: true },
            },
          },
        },
      },
    });
    if (!role) return [];

    const permissions = role.permissions.map(
      ({ permission }) =>
        `${permission.module.name}:${permission.action.toLocaleLowerCase()}`,
    );

    // Save cache
    await this.redis.set(cacheKey, JSON.stringify(permissions));

    return permissions;
  }

  async invalidateRole(roleId: string) {
    await this.redis.del(this.key(roleId));
  }

  async warmRole(roleId: string) {
    await this.invalidateRole(roleId);
    return this.getRolePermissions(roleId);
  }
}
