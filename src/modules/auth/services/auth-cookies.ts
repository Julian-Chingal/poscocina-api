import { Response } from 'express';

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  nodeEnv: string,
): void {
  const isProduction = nodeEnv === 'production';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15, // 15 min
    path: '/',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}
