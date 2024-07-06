import { Env, Environment } from './env.schema';

export interface Config {
  get<T extends keyof Env>(key: T): Env[T];
  getPort(): number;
  getEnvironment(): Environment;
}
