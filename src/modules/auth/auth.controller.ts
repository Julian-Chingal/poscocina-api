/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';
import { LoginSchema } from './dto/login.dto';
import type { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from '@shared/guards/jwt-refresh.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import type { JwtPayload } from '@shared/types/jwt-payload.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Login endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'admin@poscocina.com',
        },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso. Devuelve access y refresh tokens.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Refresh token endpoint
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener nuevo access token usando refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  @UseGuards(JwtRefreshGuard)
  refresh(
    @CurrentUser()
    user: any,
  ) {
    return this.authService.refresh(
      user.userId,
      user.sessionId,
      user.refreshToken,
    );
  }

  // Logout endpoint
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Cerrar la sesión actual (revoca el refresh token y marca sesión como terminada)',
  })
  @ApiResponse({
    status: 204,
    description: 'Sesión cerrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sessionId);
  }

  // Logout all sessions endpoint
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar todas las sesiones activas del usuario' })
  @ApiResponse({
    status: 204,
    description: 'Todas las sesiones cerradas exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @UseGuards(JwtAuthGuard)
  logoutAll(@CurrentUser() user: JwtPayload) {
    return this.authService.logoutAllSessions(user.sub);
  }
}
