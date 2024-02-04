import { Controller } from '@nestjs/common';
import { InputsService } from './inputs.service';

@Controller('inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}
}
