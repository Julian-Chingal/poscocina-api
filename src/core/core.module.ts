import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [PrismaModule, LoggerModule, RedisModule],
})
export class CoreModule {}
