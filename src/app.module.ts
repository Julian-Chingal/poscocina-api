import {
  appConfig,
  jwtConfig,
  prismaConfig,
  redisConfig,
} from './config/app.config';
import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';

// Modules
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@shared/guards';
import { PermissionCacheService } from './infrastructure/rbac';
import { PermissionsGuard } from '@shared/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, prismaConfig],
      validate: validateEnv,
      cache: true,
      expandVariables: true,
    }),

    CoreModule,

    // Modules
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    PermissionCacheService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
