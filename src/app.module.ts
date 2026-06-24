import {
  appConfig,
  jwtConfig,
  prismaConfig,
  redisConfig,
} from './config/app.config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { PermissionsGuard, JwtAuthGuard } from '@shared/guards';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

// Modules
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';

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
    InfrastructureModule,

    // Modules
    HealthModule,
    AuthModule,
    RbacModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
