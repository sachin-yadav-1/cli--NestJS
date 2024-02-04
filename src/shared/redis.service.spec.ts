import { Test, TestingModule } from '@nestjs/testing';
import { RedisServiceTsService } from './redis.service';

describe('RedisServiceTsService', () => {
  let service: RedisServiceTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisServiceTsService],
    }).compile();

    service = module.get<RedisServiceTsService>(RedisServiceTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
