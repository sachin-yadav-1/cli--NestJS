import { Module } from '@nestjs/common';
import { SharedModuleTsModule } from './shared/shared.module';
import { RedisServiceTsService } from './shared/redis.service';

@Module({
  imports: [SharedModuleTsModule],
  controllers: [],
  providers: [RedisServiceTsService],
})
export class AppModule {}
