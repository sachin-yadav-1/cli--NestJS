import { IsArray } from 'class-validator';

export class ProcessInputDto {
  @IsArray()
  numbers: (string | number)[];
}
