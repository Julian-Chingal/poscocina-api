import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RedisHealthIndicator } from './redis.health';
import { HealthResponse } from './dto/responses.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verificar el estado de salud de la aplicación y sus dependencias',
  })
  @ApiOkResponse({
    description: 'Todos los servicios están operativos.',
    type: HealthResponse,
  })
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
