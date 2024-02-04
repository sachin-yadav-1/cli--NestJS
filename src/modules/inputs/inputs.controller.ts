import { Body, Controller, Post } from '@nestjs/common';
import { FindDuplicatesInputDto } from './dtos/find-duplicates.dto';
import { ProcessInputDto } from './dtos/process-input.dto';
import { InputsService } from './inputs.service';
import { IFindDuplicatesResult } from './interfaces/find-duplicates.interface';
import { IProcessNumberResult } from './interfaces/process-inputs.interface';

@Controller('numbers')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post('process')
  async processUserInputs(
    @Body() data: ProcessInputDto,
  ): Promise<IProcessNumberResult> {
    return await this.inputsService.processUserInputs(data);
  }

  @Post('duplicates')
  async getUserDuplicateInputs(
    @Body() data: FindDuplicatesInputDto,
  ): Promise<IFindDuplicatesResult> {
    return await this.inputsService.getUserDuplicateInputs(data);
  }
}
