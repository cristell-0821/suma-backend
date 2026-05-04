import { Controller, Get } from '@nestjs/common';
import { SectorsService } from './sectors.service';

@Controller('sectors')
export class SectorsController {
  constructor(private sectorsService: SectorsService) {}

  @Get()
  findAll() {
    return this.sectorsService.findAll();
  }
}