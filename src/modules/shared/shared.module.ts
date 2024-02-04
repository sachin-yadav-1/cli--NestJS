import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';
import { RedisService } from './services/redis.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (config: ConfigService) => {
        const dbConfig = config.get<RedisOptions>('redisConfig');
        const conn = new Redis(dbConfig);
        console.log(
          'DB connection successful: ',
          `${conn.options.host}:${conn.options.port}`,
        );
        return conn;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class SharedModule {}
