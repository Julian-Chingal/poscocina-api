import { z } from 'zod';

const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('poscocina-api'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([field, errs]) => `  ${field}: ${errs?.join(', ')}`)
      .join('\n');

    throw new Error(`\n❌ Variables de entorno inválidas:\n${messages}\n`);
  }

  return result.data;
}
