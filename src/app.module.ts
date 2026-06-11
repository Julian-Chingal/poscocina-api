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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
