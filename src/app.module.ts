import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './config/redis.config';
import { InputsModule } from './modules/inputs/inputs.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
      cache: true,
      load: [redisConfig],
    }),
    SharedModule,
    InputsModule,
  ],
  controllers: [],
})
export class AppModule {}
