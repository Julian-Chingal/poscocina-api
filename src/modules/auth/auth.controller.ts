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
import { LoginUserResponse, RefreshResponse } from './dto/responses.dto';
import { ApiTags, ApiNoContentResponse } from '@nestjs/swagger';
import { CurrentUser, Public } from '@shared/decorators';
import { clearAuthCookies } from './services/auth-cookies';
import { JwtRefreshGuard } from '@shared/guards';
import type { JwtPayload } from '@shared/types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Login endpoint
  @Public()
  @Post('login')
  @ApiEntityResponse(LoginUserResponse, 'Inicio de sesión exitoso.', {
    single: true,
  })
  @ApiValidationError()
  @ApiAuthErrors()
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // Refresh token endpoint
  @Post('refresh')
  @ApiEntityResponse(RefreshResponse, 'Tokens renovados exitosamente', {
    single: true,
  })
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
  @ApiNoContentResponse({ description: 'Todas las sesiones cerradas.' })
  @ApiAuthErrors()
  logoutAll(@CurrentUser() user: JwtPayload) {
    return this.authService.logoutAllSessions(user.sub);
  }
}
