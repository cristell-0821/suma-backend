import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from '.prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(postulanteUserId: string, dto: CreateApplicationDto) {
    // Obtener el postulante
    const postulante = await this.prisma.postulante.findUnique({
      where: { userId: postulanteUserId },
    });

    if (!postulante) {
      throw new NotFoundException('Postulante no encontrado');
    }

    // Verificar que la oferta existe y está activa
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id: dto.jobOfferId },
      include: { disabilities: true },
    });

    if (!jobOffer) {
      throw new NotFoundException('Oferta de trabajo no encontrada');
    }

    if (!jobOffer.isActive) {
      throw new ForbiddenException('Esta oferta ya no está activa');
    }

    // Verificar que no ha aplicado antes
    const existingApplication = await this.prisma.application.findUnique({
      where: {
        postulanteId_jobOfferId: {
          postulanteId: postulante.id,
          jobOfferId: dto.jobOfferId,
        },
      },
    });

    if (existingApplication) {
      throw new ConflictException('Ya has aplicado a esta oferta');
    }

    // Crear la aplicación
    return this.prisma.application.create({
      data: {
        postulanteId: postulante.id,
        jobOfferId: dto.jobOfferId,
        mensaje: dto.mensaje,
        status: 'ENVIADO',
      },
      include: {
        jobOffer: {
          include: {
            empresa: {
              select: {
                razonSocial: true,
              },
            },
          },
        },
      },
    });
  }

  async getMyApplications(postulanteUserId: string) {
    const postulante = await this.prisma.postulante.findUnique({
      where: { userId: postulanteUserId },
    });

    if (!postulante) {
      throw new NotFoundException('Postulante no encontrado');
    }

    return this.prisma.application.findMany({
      where: { postulanteId: postulante.id },
      include: {
        jobOffer: {
          include: {
            empresa: {
              select: {
                razonSocial: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApplicationsForEmpresa(empresaUserId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId: empresaUserId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.application.findMany({
      where: {
        jobOffer: {
          empresaId: empresa.id,
        },
      },
      include: {
        postulante: {
          include: {
            disabilities: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        jobOffer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(empresaUserId: string, applicationId: string, newStatus: ApplicationStatus,) {
    // Verificar que la aplicación pertenece a una oferta de esta empresa
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId: empresaUserId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        jobOffer: {
          empresaId: empresa.id,
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Aplicación no encontrada');
    }

    const validStatuses = ['ENVIADO', 'EN_REVISION', 'ENTREVISTA', 'RECHAZADO', 'CONTRATADO'];
    if (!validStatuses.includes(newStatus)) {
      throw new ForbiddenException('Estado no válido');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
      include: {
        postulante: true,
        jobOffer: true,
      },
    });
  }
}