import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('disabilities')
export class DisabilitiesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.disability.findMany({
      orderBy: {
        categoria: 'asc',
      },
    });
  }
}