import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalPostulantes,
      totalEmpresas,
      empresasPendientes,
      totalOfertas,
    ] = await Promise.all([
      this.prisma.postulante.count(),
      this.prisma.empresa.count(),
      this.prisma.empresa.count({ where: { isApproved: false } }),
      this.prisma.jobOffer.count(),
    ]);

    return {
      totalPostulantes,
      totalEmpresas,
      empresasPendientes,
      totalOfertas,
    };
  }

  async getPendingCompanies() {
    return this.prisma.empresa.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async approveCompany(empresaId: string) {
    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
      },
    });
  }

  async rejectCompany(empresaId: string) {
    // Opcional: podrías eliminar o marcar como rechazada
    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        isApproved: false,
        // podrías agregar un campo `isRejected` si lo necesitas
      },
    });
  }

  async verifyCompany(empresaId: string) {
    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        isVerified: true,
      },
    });
  }
}