import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RoleService } from './services/roles.service';
import { AuthModule } from '../auth/auth.module';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { ModulesController } from './controllers/module.controller';
import { ModulesService } from './services/module.service';

@Module({
  imports: [AuthModule],
  controllers: [RolesController, PermissionController, ModulesController],
  providers: [RoleService, PermissionService, ModulesService],
})
export class RbacModule {}
