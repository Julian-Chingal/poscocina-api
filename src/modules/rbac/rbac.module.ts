import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RoleService } from './services/roles.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [],
  controllers: [RolesController],
  providers: [RoleService, AuthService],
})
export class RbacModule {}
