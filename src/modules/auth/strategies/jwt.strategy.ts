/* eslint-disable @typescript-eslint/no-unsafe-return */
import { RedisService } from '@core/redis/redis.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@shared/types/jwt-payload.type';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      secretOrKey: config.getOrThrow('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const session = await this.redis.get(`session:${payload.sessionId}`);
    if (!session) throw new UnauthorizedException('Session expired');
    return payload;
  }
}
