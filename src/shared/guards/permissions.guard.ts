/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  IS_PUBLIC_KEY,
  MODULE_PERMISSION_KEY,
  PERMISSION_KEY,
} from '@shared/decorators';
import { PermissionCacheService } from 'src/infrastructure/rbac';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsCache: PermissionCacheService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Ruta publica
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Rutas libres
    const module = this.reflector.getAllAndOverride<string>(
      MODULE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const action = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
    ]);

    // Si no hay metadata => acceso libre
    if (!module && !action) return true;

    const normalizedModule = module.toLowerCase();
    const normalizedAction = action.toLowerCase();

    // Validacion Roles
    const request = context.switchToHttp().getRequest();
    const roleId = request.user?.roleId as string;
    if (!roleId) throw new ForbiddenException('Role Not Found');

    const permissions = await this.permissionsCache.getRolePermissions(roleId);
    const required = `${normalizedModule}:${normalizedAction}`;

    const hasAccess = this.hasPermission(
      permissions,
      normalizedModule,
      normalizedAction,
    );
    if (!hasAccess)
      throw new ForbiddenException(`Missing permission ${required}`);

    return true;
  }

  private hasPermission(
    permissions: string[],
    module: string,
    action: string,
  ): boolean {
    const required = `${module}:${action}`;

    return permissions.some((p) => {
      if (p === required) return true;

      // support wildcard manage
      if (p === `${module}:manage`) return true;

      return false;
    });
  }
}
