import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RoleService } from './services/roles.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RolesController],
  providers: [RoleService],
})
export class RbacModule {}
