import { RedisOptions } from 'ioredis';

export default async (): Promise<{ redisConfig: RedisOptions }> => {
  return {
    redisConfig: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  };
};
