import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Env } from './env.schema';
import { Config } from './config.interface';

@Injectable()
export class ConfigService implements Config {
  constructor(private configService: NestConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }

  getPort() {
    return this.get('PORT');
  }

  getEnvironment() {
    return this.get('NODE_ENV');
  }
}
