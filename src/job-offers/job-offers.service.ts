import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobOfferDto) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (!empresa.isApproved) {
      throw new ForbiddenException('Tu empresa aún no ha sido aprobada');
    }

    const { disabilityIds, sectorId, ciudadId, ...data } = dto as any;

    // Verificar discapacidades
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
        empresa: { connect: { id: empresa.id } },
        sector: { connect: { id: sectorId } },
        ciudad: { connect: { id: ciudadId } },
        disabilities: {
          connect: disabilityIds.map((id: string) => ({ id })),
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
        sector: true,
        ciudad: {
          include: {
            departamento: true,
          },
        },
      },
    });
  }

  async findAll(filters: {
    modality?: string;
    sectorId?: string;
    ciudadId?: string;
    disabilityId?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters.modality) where.modalidad = filters.modality;
    if (filters.sectorId) where.sectorId = filters.sectorId;
    if (filters.ciudadId) where.ciudadId = filters.ciudadId;
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
        sector: true,
        ciudad: {
          include: {
            departamento: true,
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

  async update(userId: string, offerId: string, dto: UpdateJobOfferDto) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const existingOffer = await this.prisma.jobOffer.findFirst({
      where: {
        id: offerId,
        empresaId: empresa.id,
      },
    });

    if (!existingOffer) {
      throw new NotFoundException('Oferta no encontrada o no pertenece a tu empresa');
    }

    const { disabilityIds, sectorId, ciudadId, ...data } = dto as any;

    if (disabilityIds && disabilityIds.length > 0) {
      const existingDisabilities = await this.prisma.disability.findMany({
        where: { id: { in: disabilityIds } },
      });

      if (existingDisabilities.length !== disabilityIds.length) {
        throw new NotFoundException('Algunas discapacidades no existen');
      }
    }

    const updateData: any = { ...data };

    if (sectorId) {
      updateData.sector = { connect: { id: sectorId } };
    }
    if (ciudadId) {
      updateData.ciudad = { connect: { id: ciudadId } };
    }

    return this.prisma.jobOffer.update({
      where: { id: offerId },
      data: {
        ...updateData,
        ...(disabilityIds && {
          disabilities: {
            set: disabilityIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        disabilities: true,
        empresa: {
          select: {
            razonSocial: true,
            isVerified: true,
          },
        },
        sector: true,
        ciudad: {
          include: {
            departamento: true,
          },
        },
      },
    });
  }

   async remove(userId: string, offerId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const existingOffer = await this.prisma.jobOffer.findFirst({
      where: {
        id: offerId,
        empresaId: empresa.id,
      },
    });

    if (!existingOffer) {
      throw new NotFoundException('Oferta no encontrada o no pertenece a tu empresa');
    }

    return this.prisma.jobOffer.delete({
      where: { id: offerId },
    });
  }

  async toggleActive(userId: string, offerId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const existingOffer = await this.prisma.jobOffer.findFirst({
      where: {
        id: offerId,
        empresaId: empresa.id,
      },
    });

    if (!existingOffer) {
      throw new NotFoundException('Oferta no encontrada o no pertenece a tu empresa');
    }

    return this.prisma.jobOffer.update({
      where: { id: offerId },
      data: { isActive: !existingOffer.isActive },
      include: {
        disabilities: true,
        _count: {
          select: { applications: true },
        },
      },
    });
  }
}