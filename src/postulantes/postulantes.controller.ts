import { Controller, Get, Put, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostulantesService } from './postulantes.service';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('postulantes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PostulantesController {
  constructor(private postulantesService: PostulantesService) {}

  @Get('perfil')
  @Roles(Role.POSTULANTE)
  getProfile(@CurrentUser('userId') userId: string) {
    return this.postulantesService.getProfile(userId);
  }

  @Put('perfil')
  @Roles(Role.POSTULANTE)
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePostulanteDto,
  ) {
    return this.postulantesService.updateProfile(userId, dto);
  }

  @Get('ofertas')
  @Roles(Role.POSTULANTE)
  getJobOffers(
    @Query('modality') modality?: string,
    @Query('sector') sector?: string,
    @Query('city') city?: string,
    @Query('disabilityId') disabilityId?: string,
  ) {
    return this.postulantesService.getJobOffers({
      modality,
      sector,
      city,
      disabilityId,
    });
  }
}