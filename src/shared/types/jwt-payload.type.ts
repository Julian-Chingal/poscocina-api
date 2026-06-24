export interface JwtPayload {
  sub: string;
  email: string;
  roleId: string;
  role: string;
  sessionId: string;
}

export interface JwtRefreshPayload {
  sub: string;
  sessionId: string;
}
