import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = (action: 'read' | 'write' | 'delete' | 'manage') =>
  SetMetadata(PERMISSION_KEY, action);
