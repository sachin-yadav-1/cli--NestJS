import { Injectable } from '@nestjs/common';
import { RedisService } from '../shared/services/redis.service';

@Injectable()
export class InputsService {
  constructor(private readonly redisService: RedisService) {}
}
