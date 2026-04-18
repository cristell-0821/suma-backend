import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmpresasService } from './empresas.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('empresas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmpresasController {
  constructor(private empresasService: EmpresasService) {}

  @Get('perfil')
  @Roles(Role.EMPRESA)
  getProfile(@CurrentUser('userId') userId: string) {
    return this.empresasService.getProfile(userId);
  }

  @Put('perfil')
  @Roles(Role.EMPRESA)
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateEmpresaDto,
  ) {
    return this.empresasService.updateProfile(userId, dto);
  }
}