import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async addValuesToSet(key: any, value: any[]): Promise<any> {
    return await this.redisClient.sadd(key, ...value);
  }

  async fetchSetValues(key: string): Promise<any> {
    return await this.redisClient.smembers(key);
  }

  async keyExists(key: string): Promise<any> {
    return await this.redisClient.exists(key);
  }

  async deleteKey(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }
}
