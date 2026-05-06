import { Controller, Get, Post, Param, UseGuards, Body, Patch } from '@nestjs/common';
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

  // Todas las empresas (para gestión)
  @Get('empresas')
  @Roles(Role.SUPERADMIN)
  async getAllCompanies() {
    const empresas = await this.adminService.getAllCompanies();
    return {
      count: empresas.length,
      empresas,
    };
  }

  // Empresas pendientes (mantener por si acaso)
  @Get('empresas/pendientes')
  @Roles(Role.SUPERADMIN)
  async getPendingCompanies() {
    const empresas = await this.adminService.getPendingCompanies();
    return {
      count: empresas.length,
      empresas,
    };
  }

  // Toggle verificación
  @Post('empresas/:id/verificar')
  @Roles(Role.SUPERADMIN)
  async verifyCompany(@Param('id') id: string) {
    const empresa = await this.adminService.verifyCompany(id);
    return {
      message: empresa.isVerified 
        ? 'Empresa verificada como inclusiva' 
        : 'Verificación removida',
      empresa,
    };
  }

  // Toggle deshabilitar/habilitar
  @Patch('empresas/:id/estado')
  @Roles(Role.SUPERADMIN)
  async toggleCompanyStatus(@Param('id') id: string) {
    const empresa = await this.adminService.toggleCompanyStatus(id);
    return {
      message: empresa.isActive 
        ? 'Empresa habilitada' 
        : 'Empresa deshabilitada',
      empresa,
    };
  }
}