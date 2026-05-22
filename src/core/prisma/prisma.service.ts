/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma-client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('database.databaseUrl'),
    });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conexion exitosa a la base de datos.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconexión exitosa de la base de datos.');
  }
}
