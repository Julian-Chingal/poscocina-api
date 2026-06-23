import { PrismaService } from '@core/prisma/prisma.service';
import { RedisService } from '@core/redis/redis.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload, JwtRefreshPayload } from '@shared/types/jwt-payload.type';
import { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { RefreshTokenHashService, setAuthCookies } from './services';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly refreshTokenHash: RefreshTokenHashService,
  ) {}

  async login(dto: LoginDto, res: Response) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  include: { module: true },
                },
              },
            },
          },
        },
      },
    });

    // Validacion de usuario y contraseña
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive)
      throw new UnauthorizedException('User account is inactive');

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid)
      throw new UnauthorizedException('Invalid email or password');

    // Session
    const sessionId: string = uuidv4();

    // Token
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      sessionId,
    });

    // Set Cookies
    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this.configService.getOrThrow<string>('app.nodeEnv'),
    );

    // Return
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    };
  }

  async refresh(
    userId: string,
    sessionId: string,
    refreshToken: string,
    res: Response,
  ) {
    const sessionRaw = await this.redis.get(`session:${sessionId}`);
    if (!sessionRaw) throw new UnauthorizedException('Session expired');

    const session = JSON.parse(sessionRaw) as {
      userId: string;
      refreshTokenHash: string;
    };

    // Validar token
    const refreshValid = this.refreshTokenHash.compare(
      refreshToken,
      session.refreshTokenHash,
    );
    if (!refreshValid) {
      // El hash no coincide: posible robo/reuso de un refresh token
      await this.logoutAllSessions(session.userId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // User
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: { include: { module: true } } },
            },
          },
        },
      },
    });

    if (!user || !user.isActive)
      throw new UnauthorizedException('User not found or inactive');

    // Generar nuevos tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      sessionId,
    });

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this.configService.getOrThrow<string>('app.nodeEnv'),
    );
    return { message: 'Tokens renewed' };
  }

  async logout(sessionId: string) {
    const sessionRaw = await this.redis.get(`session:${sessionId}`);
    if (!sessionRaw) return;

    const session = JSON.parse(sessionRaw) as {
      userId: string;
    };

    await this.redis.srem(`user:${session.userId}:sessions`, sessionId);
    await this.redis.del(`session:${sessionId}`);
  }

  async logoutAllSessions(userId: string) {
    const sessions = await this.redis.smembers(`user:${userId}:sessions`);
    if (!sessions.length) return;

    const pipeline = this.redis.multi();

    for (const sessionId of sessions) {
      pipeline.del(`session:${sessionId}`);
    }

    pipeline.del(`user:${userId}:sessions`);

    await pipeline.exec();
  }

  private async generateTokens(payload: JwtPayload) {
    const accessPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: payload.sub,
      sessionId: payload.sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.expiresIn',
        ) as SignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.refreshExpiresIn',
        ) as SignOptions['expiresIn'],
      }),
    ]);

    // Guardar en redis
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const ttlSeconds = 60 * 60 * 24 * 7; // 7 dias

    await this.redis.set(
      `session:${payload.sessionId}`,
      JSON.stringify({
        userId: payload.sub,
        refreshTokenHash,
      }),
      'EX',
      ttlSeconds,
    );

    await this.redis.sadd(`user:${payload.sub}:sessions`, payload.sessionId);

    // Retornar tokens
    return { accessToken, refreshToken };
  }
}
