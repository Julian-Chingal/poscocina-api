import { Global, Module } from '@nestjs/common';
import { PermissionCacheService } from './rbac';

@Global()
@Module({
  providers: [PermissionCacheService],
  exports: [PermissionCacheService],
})
export class InfrastructureModule {}
