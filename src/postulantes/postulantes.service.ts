import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';

@Injectable()
export class PostulantesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const postulante = await this.prisma.postulante.findUnique({
      where: { userId },
      include: {
        disabilities: true,
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
    });

    if (!postulante) {
      throw new NotFoundException('Perfil no encontrado');
    }

    // Mapear _count a campos planos para el frontend
    return {
      ...postulante,
      applicationsCount: postulante._count.applications,
      savedJobsCount: postulante._count.savedJobs,
    };
  }

  async updateProfile(userId: string, dto: UpdatePostulanteDto) {
    const { disabilityIds, fechaNacimiento, ...rest } = dto;

    const data: any = { ...rest };

    // Convertir fecha string a Date si existe
    if (fechaNacimiento) {
      data.fechaNacimiento = new Date(fechaNacimiento);
    }

    const postulante = await this.prisma.postulante.update({
      where: { userId },
      data: {
        ...data,
        ...(disabilityIds && {
          disabilities: {
            set: disabilityIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        disabilities: true,
        user: { select: { id: true, email: true } },
      },
    });

    return postulante;
  }

  async getJobOffers(filters: {
    modality?: string;
    sector?: string;
    city?: string;
    disabilityId?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters.modality) {
      where.modalidad = filters.modality;
    }

    if (filters.sector) {
      where.sector = filters.sector;
    }

    if (filters.city) {
      where.ciudad = filters.city;
    }

    if (filters.disabilityId) {
      where.disabilities = {
        some: {
          id: filters.disabilityId,
        },
      };
    }

    return this.prisma.jobOffer.findMany({
      where,
      include: {
        empresa: {
          select: {
            razonSocial: true,
            isVerified: true,
          },
        },
        disabilities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}