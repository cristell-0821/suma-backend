import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApplicationStatus } from '.prisma/client';

@Controller('applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  // Postulante: aplicar a una oferta
  @Post()
  @Roles(Role.POSTULANTE)
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(userId, dto);
  }

  // Postulante: ver mis aplicaciones
  @Get('mis-postulaciones')
  @Roles(Role.POSTULANTE)
  getMyApplications(@CurrentUser('userId') userId: string) {
    return this.applicationsService.getMyApplications(userId);
  }

  // Empresa: ver aplicaciones a mis ofertas
  @Get('empresa/postulantes')
  @Roles(Role.EMPRESA)
  getApplicationsForEmpresa(@CurrentUser('userId') userId: string) {
    return this.applicationsService.getApplicationsForEmpresa(userId);
  }

  // Empresa: cambiar estado de aplicación
  @Put(':id/estado')
  @Roles(Role.EMPRESA)
  updateStatus(
    @CurrentUser('userId') userId: string,
    @Param('id') applicationId: string,
    @Body('status') status: string,
  ) {
    return this.applicationsService.updateStatus(userId, applicationId, status as ApplicationStatus,);
  }
}