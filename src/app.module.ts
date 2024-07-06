import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './shared/infrastructure/config/config.module';
import { UsersModule } from './users/infrastructure/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
