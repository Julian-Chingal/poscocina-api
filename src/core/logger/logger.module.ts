/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get('app.isProduction') ? 'info' : 'debug',
          transport: config.get('app.isDevelopment')
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,

          // Redactar campos sensibles
          redact: {
            paths: [
              'req.headers.authorization',
              '*.password',
              '*.token',
              '*.refreshToken',
            ],
            censor: '[REDACTED]',
          },

          // Serializar el request de forma útil
          serializers: {
            req(req: any) {
              return {
                method: req.method,
                url: req.url,
                userId: req.raw?.user?.sub ?? 'anonymous',
              };
            },
          },

          // No logear health checks
          autoLogging: {
            ignore: (req) => req.url === '/health',
          },
        },
        forRoutes: [{ path: '*path', method: RequestMethod.ALL }],
      }),
    }),
  ],
})
export class LoggerModule {}
