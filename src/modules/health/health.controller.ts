import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { RedisHealthIndicator } from './redis.health';

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
    schema: {
      example: {
        status: 'ok',
        info: {
          database: { status: 'up' },
          redis: { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
          redis: { status: 'up' },
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Uno o más servicios no están disponibles.',
    schema: {
      example: {
        status: 'error',
        info: {},
        error: {
          database: { status: 'down', message: 'Connection refused' },
        },
        details: {
          database: { status: 'down', message: 'Connection refused' },
        },
      },
    },
  })
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
