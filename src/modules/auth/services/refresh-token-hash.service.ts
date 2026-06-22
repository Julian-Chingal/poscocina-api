import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenHashService {
  constructor(private readonly configService: ConfigService) {}

  hash(token: string): string {
    const secret = this.getSecret();
    return crypto.createHmac('sha256', secret).update(token).digest('hex');
  }

  compare(token: string, storedHash: string): boolean {
    const computedHash = this.hash(token);

    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, storedBuffer);
  }

  private getSecret(): string {
    return this.configService.getOrThrow<string>('jwt.refreshSecret');
  }
}
