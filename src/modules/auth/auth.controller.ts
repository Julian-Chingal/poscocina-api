import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RefreshResponse } from './dto/responses.dto';
import { JwtRefreshGuard, JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import type { JwtPayload } from '@shared/types';
import type { Response } from 'express';
import { clearAuthCookies } from './services/auth-cookies';
import {
  ApiAuth,
  ApiValidationError,
  ApiAuthErrors,
} from '@shared/swagger/decorators';
import { UnauthorizedResponse } from '@shared/swagger/responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Login endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiOkResponse({
    type: LoginResponse,
    description: 'Inicio de sesión exitoso. Tokens enviados vía cookies.',
  })
  @ApiValidationError()
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Credenciales inválidas.',
  })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // Refresh token endpoint
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar access token usando el refresh token de la cookie',
  })
  @ApiOkResponse({
    type: RefreshResponse,
    description: 'Tokens renovados exitosamente vía cookies.',
  })
  @ApiAuth()
  @ApiAuthErrors()
  @ApiValidationError()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser()
    user: { userId: string; sessionId: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(
      user.userId,
      user.sessionId,
      user.refreshToken,
      res,
    );
  }

  // Logout endpoint
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Cerrar la sesión actual (revoca el refresh token y marca sesión como terminada)',
  })
  @ApiNoContentResponse({ description: 'Sesión cerrada exitosamente.' })
  @ApiAuth()
  @ApiAuthErrors()
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sessionId);
    clearAuthCookies(res);
    return;
  }

  // Logout all sessions endpoint
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar todas las sesiones activas del usuario' })
  @ApiNoContentResponse({
    description: 'Todas las sesiones cerradas exitosamente.',
  })
  @ApiAuth()
  @ApiAuthErrors()
  @UseGuards(JwtAuthGuard)
  logoutAll(@CurrentUser() user: JwtPayload) {
    return this.authService.logoutAllSessions(user.sub);
  }
}
