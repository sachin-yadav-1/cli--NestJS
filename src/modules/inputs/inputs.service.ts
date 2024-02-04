import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../shared/services/redis.service';
import { FindDuplicatesInputDto } from './dtos/find-duplicates.dto';
import { ProcessInputDto } from './dtos/process-input.dto';
import { IFindDuplicatesResult } from './interfaces/find-duplicates.interface';
import { IProcessNumberResult } from './interfaces/process-inputs.interface';

@Injectable()
export class InputsService {
  constructor(private readonly redisService: RedisService) {}

  async processUserInputs(
    data: ProcessInputDto,
  ): Promise<IProcessNumberResult> {
    const { numbers } = data;

    if (numbers.length) {
      await this.redisService.addValuesToSet(
        'inputs',
        this.getFinalNumbersFromUserInput(numbers),
      );
    }

    const res = await this.redisService.fetchSetValues('inputs');
    return { numbers: res.map(Number) };
  }

  async getUserDuplicateInputs(
    data: FindDuplicatesInputDto,
  ): Promise<IFindDuplicatesResult> {
    const { numbers } = data;
    if (!numbers.length) {
      return {
        unique: [],
        duplicates: [],
      };
    }

    const ig_numbers = this.getFinalNumbersFromUserInput(numbers);
    const existing_numbers = (
      await this.redisService.fetchSetValues('inputs')
    ).map((v: string) => Number(v));

    const { duplicates, unique } = this.getDuplicatesAndUniqueValues(
      ig_numbers,
      existing_numbers,
    );

    return {
      unique,
      duplicates,
    };
  }

  /**
   * user input might have single numbers or a range of numbers,
   * this function will return an array with the incoming individual values and,
   * the values between the provided ranges
   */
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

  /**
   * this function will do the following:
   * 1. collect unique values of incoming array in "ig_arr_unique"
   * 2. find duplicates values that exists in DB
   */
  getDuplicatesAndUniqueValues(
    ig_arr: number[],
    existing_arr: number[],
  ): { unique: number[]; duplicates: number[] } {
    const ig_arr_unique = {};
    const ig_arr_duplicates = [];

    const existing_arr_unique = new Set(existing_arr);

    ig_arr.forEach((val) => {
      if (existing_arr_unique.has(val)) {
        ig_arr_duplicates.push(val);
      } else if (!ig_arr_unique[val]) {
        ig_arr_unique[val] = true;
      }
    });

    return {
      unique: Object.keys(ig_arr_unique).map(Number),
      duplicates: Array.from(new Set(ig_arr_duplicates)),
    };
  }
}
