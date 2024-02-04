import { Body, Controller, Post } from '@nestjs/common';
import { InputsService } from './inputs.service';

@Controller('numbers')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post('process')
  async processUserInputs(@Body() data: any): Promise<any> {
    return await this.inputsService.processUserInputs(data);
  }

  @Post('duplicates')
  async getUserDuplicateInputs(@Body() data: any): Promise<any> {
    return await this.inputsService.getUserDuplicateInputs(data.numbers);
  }
}
