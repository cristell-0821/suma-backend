import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('job-offers')
export class JobOffersController {
  constructor(private jobOffersService: JobOffersService) {}

  // Público: listar ofertas (para postulantes)
  @Get()
  findAll(
    @Query('modality') modality?: string,
    @Query('sector') sector?: string,
    @Query('city') city?: string,
    @Query('disabilityId') disabilityId?: string,
  ) {
    return this.jobOffersService.findAll({
      modality,
      sector,
      city,
      disabilityId,
    });
  }

  // Público: ver detalle de oferta
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOffersService.findOne(id);
  }

  // Empresa: crear oferta (requiere autenticación y rol EMPRESA)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateJobOfferDto,
  ) {
    return this.jobOffersService.create(userId, dto);
  }

  // Empresa: ver mis ofertas
  @Get('empresa/mis-ofertas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  findByEmpresa(@CurrentUser('userId') userId: string) {
    return this.jobOffersService.findByEmpresa(userId);
  }
}