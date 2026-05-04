import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('job-offers')
export class JobOffersController {
  constructor(private jobOffersService: JobOffersService) {}

  // Público: listar ofertas (ya existe)
  @Get()
  findAll(
    @Query('modality') modality?: string,
    @Query('sectorId') sectorId?: string,      // ← cambiado de sector
    @Query('ciudadId') ciudadId?: string,      // ← cambiado de city
    @Query('disabilityId') disabilityId?: string,
  ) {
    return this.jobOffersService.findAll({
      modality,
      sectorId,
      ciudadId,
      disabilityId,
    });
  }

  // Público: ver detalle de oferta (ya existe)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOffersService.findOne(id);
  }

  // Empresa: crear oferta (ya existe)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateJobOfferDto,
  ) {
    return this.jobOffersService.create(userId, dto);
  }

  // Empresa: ver mis ofertas (ya existe)
  @Get('empresa/mis-ofertas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  findByEmpresa(@CurrentUser('userId') userId: string) {
    return this.jobOffersService.findByEmpresa(userId);
  }

  // ← NUEVO: Editar oferta
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') offerId: string,
    @Body() dto: UpdateJobOfferDto,
  ) {
    return this.jobOffersService.update(userId, offerId, dto);
  }

  // ← NUEVO: Eliminar oferta
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  remove(
    @CurrentUser('userId') userId: string,
    @Param('id') offerId: string,
  ) {
    return this.jobOffersService.remove(userId, offerId);
  }

  // ← NUEVO: Activar/desactivar oferta
  @Patch(':id/toggle')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.EMPRESA)
  toggleActive(
    @CurrentUser('userId') userId: string,
    @Param('id') offerId: string,
  ) {
    return this.jobOffersService.toggleActive(userId, offerId);
  }
}