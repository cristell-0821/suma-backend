import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalPostulantes,
      totalEmpresas,
      empresasVerificadas,
      totalOfertas,
      empresasDeshabilitadas,
    ] = await Promise.all([
      this.prisma.postulante.count(),
      this.prisma.empresa.count(),
      this.prisma.empresa.count({ where: { isVerified: true } }),
      this.prisma.jobOffer.count(),
      this.prisma.empresa.count({ where: { isActive: false } }),
    ]);

    return {
      totalPostulantes,
      totalEmpresas,
      empresasVerificadas,
      totalOfertas,
      empresasDeshabilitadas,
    };
  }

  async getAllCompanies() {
    return this.prisma.empresa.findMany({
      take: 50,
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
            isActive: true,
          },
        },
        sector: true,
        ciudad: true,
        _count: {
          select: {
            jobOffers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPendingCompanies() {
    return this.prisma.empresa.findMany({
      where: { isVerified: false },
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async verifyCompany(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) throw new Error('Empresa no encontrada');

    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        isVerified: !empresa.isVerified,
      },
    });
  }

  async toggleCompanyStatus(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) throw new Error('Empresa no encontrada');

    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: {
        isActive: !empresa.isActive,
      },
    });
  }
}