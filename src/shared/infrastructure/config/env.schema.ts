import { z } from 'zod';

const environment = ['development', 'production', 'test'] as const;

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(environment).default('development'),
});

export type Env = z.infer<typeof envSchema>;
export type Environment = (typeof environment)[number];

export const validateEnv = (config: any): Env => envSchema.parse(config);
