import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      password: configService.get<string>('redis.password'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 3000);
        this.logger.warn(`Redis: Reconnecting in ${delay}ms...`);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.on('connect', () => this.logger.log('Connected to Redis'));
    this.on('error', (err) => this.logger.error('Redis error', err));
    this.on('close', () => this.logger.warn('Redis connection closed'));
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.quit();
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.set(key, serialized);
    }
  }
}
