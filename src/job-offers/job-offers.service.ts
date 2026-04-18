import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobOfferDto) {
    // Verificar que la empresa está aprobada
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (!empresa.isApproved) {
      throw new ForbiddenException('Tu empresa aún no ha sido aprobada');
    }

    const { disabilityIds, ...data } = dto;

    // Verificar que las discapacidades existen
    if (disabilityIds && disabilityIds.length > 0) {
      const existingDisabilities = await this.prisma.disability.findMany({
        where: { id: { in: disabilityIds } },
      });

      if (existingDisabilities.length !== disabilityIds.length) {
        throw new NotFoundException('Algunas discapacidades no existen');
      }
    }

    return this.prisma.jobOffer.create({
      data: {
        ...data,
        empresaId: empresa.id,
        disabilities: {
          connect: disabilityIds.map((id) => ({ id })),
        },
      },
      include: {
        disabilities: true,
        empresa: {
          select: {
            razonSocial: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async findAll(filters: {
    modality?: string;
    sector?: string;
    city?: string;
    disabilityId?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters.modality) where.modalidad = filters.modality;
    if (filters.sector) where.sector = filters.sector;
    if (filters.city) where.ciudad = filters.city;
    if (filters.disabilityId) {
      where.disabilities = { some: { id: filters.disabilityId } };
    }

    return this.prisma.jobOffer.findMany({
      where,
      include: {
        disabilities: true,
        empresa: {
          select: {
            razonSocial: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmpresa(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.jobOffer.findMany({
      where: { empresaId: empresa.id },
      include: {
        disabilities: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        disabilities: true,
        empresa: {
          select: {
            razonSocial: true,
            descripcion: true,
            isVerified: true,
            sitioWeb: true,
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return offer;
  }
}