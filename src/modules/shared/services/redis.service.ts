import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setKey(key: string, value: any): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }
}
