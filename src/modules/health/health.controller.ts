import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RedisHealthIndicator } from './redis.health';
import { HealthResponse } from './dto/responses.dto';
import { ApiEntityResponse } from '@shared/swagger/decorators';
import { Public } from '@shared/decorators';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck({ swaggerDocumentation: false })
  @ApiEntityResponse(HealthResponse, 'Health', { single: true })
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
