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
  ApiValidationError,
  ApiAuthErrors,
  ApiEntityResponse,
} from '@shared/swagger/decorators';
import { ApiTags, ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RefreshResponse } from './dto/responses.dto';
import { JwtRefreshGuard } from '@shared/guards';
import { CurrentUser, Public } from '@shared/decorators';
import type { JwtPayload } from '@shared/types';
import type { Response } from 'express';
import { clearAuthCookies } from './services/auth-cookies';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Login endpoint
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiEntityResponse(LoginResponse, 'Inicio de sesión exitoso.')
  @ApiValidationError()
  @ApiAuthErrors()
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // Refresh token endpoint
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiEntityResponse(RefreshResponse, 'Tokens renovados exitosamente')
  @ApiValidationError()
  @ApiAuthErrors()
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
  @ApiOperation({ summary: 'Cerrar la sesión actual' })
  @ApiNoContentResponse({ description: 'Sesión cerrada exitosamente.' })
  @ApiAuthErrors()
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
  @ApiNoContentResponse({ description: 'Todas las sesiones cerradas.' })
  @ApiAuthErrors()
  logoutAll(@CurrentUser() user: JwtPayload) {
    return this.authService.logoutAllSessions(user.sub);
  }
}
