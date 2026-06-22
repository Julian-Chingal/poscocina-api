import { ApiProperty } from '@nestjs/swagger';

class ServiceStatus {
  @ApiProperty({
    example: 'up',
  })
  status!: string;
}

class HealthInfo {
  @ApiProperty({
    type: ServiceStatus,
  })
  database!: ServiceStatus;

  @ApiProperty({
    type: ServiceStatus,
  })
  redis!: ServiceStatus;
}

export class HealthResponse {
  @ApiProperty({
    example: 'ok',
  })
  status!: string;

  @ApiProperty({
    type: HealthInfo,
  })
  info!: HealthInfo;

  @ApiProperty({
    example: {},
  })
  error!: Record<string, any>;

  @ApiProperty({
    type: HealthInfo,
  })
  details!: HealthInfo;
}
