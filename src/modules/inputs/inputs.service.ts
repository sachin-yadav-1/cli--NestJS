import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../shared/services/redis.service';

@Injectable()
export class InputsService {
  constructor(private readonly redisService: RedisService) {}

  async processUserInputs(data: {
    numbers: (number | string)[];
  }): Promise<any> {
    const { numbers } = data;

    if (numbers.length) {
      await this.redisService.addValuesToSet(
        'inputs',
        this.getFinalNumbersFromUserInput(numbers),
      );
    }

    const res = await this.redisService.fetchSetValues('inputs');
    return res.length ? res.map(Number) : [];
  }

  async getUserDuplicateInputs(numbers: (number | string)[]): Promise<any> {
    if (!numbers.length) {
      return {
        unique: [],
        duplicates: [],
      };
    }

    const final_numbers = this.getFinalNumbersFromUserInput(numbers);
    const existing_numbers = new Set(
      (await this.redisService.fetchSetValues('inputs')).map((v: string) =>
        Number(v),
      ),
    );

    const unique = [];
    const duplicates = final_numbers.filter((value) => {
      if (!existing_numbers.has(+value)) unique.push(value);
      return existing_numbers.has(+value);
    });

    return {
      unique,
      duplicates,
    };
  }

  getFinalNumbersFromUserInput(numbers: (number | string)[]): number[] {
    return numbers.reduce((acc, num): number[] => {
      if (typeof num === 'string' && num.includes('-')) {
        const [start, end] = num.split('-').map(Number);

        if (!start || !end) throw new BadRequestException('invalid input!');

        for (let i = start; i <= end; i++) {
          acc.push(i);
        }
      } else {
        if (!+num) throw new BadRequestException('invalid input!');
        acc.push(+num);
      }

      return acc;
    }, []);
  }
}
