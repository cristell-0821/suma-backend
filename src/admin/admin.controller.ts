import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.SUPERADMIN)
  async getDashboard(@CurrentUser() user: any) {
    const stats = await this.adminService.getStats();
    
    return {
      message: 'Bienvenido al panel de administración',
      admin: user,
      stats,
    };
  }

  @Get('empresas/pendientes')
  @Roles(Role.SUPERADMIN)
  async getPendingCompanies() {
    const empresas = await this.adminService.getPendingCompanies();
    return {
      count: empresas.length,
      empresas,
    };
  }

  @Post('empresas/:id/aprobar')
  @Roles(Role.SUPERADMIN)
  async approveCompany(@Param('id') id: string) {
    const empresa = await this.adminService.approveCompany(id);
    return {
      message: 'Empresa aprobada exitosamente',
      empresa,
    };
  }

  @Post('empresas/:id/verificar')
  @Roles(Role.SUPERADMIN)
  async verifyCompany(@Param('id') id: string) {
    const empresa = await this.adminService.verifyCompany(id);
    return {
      message: 'Empresa verificada como inclusiva',
      empresa,
    };
  }
}