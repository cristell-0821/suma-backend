// src/postulantes/postulantes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';
import { FileType } from './dto/upload-file.dto';
import { MulterFile } from '../types/multer';

@Injectable()
export class PostulantesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    const postulante = await this.prisma.postulante.findUnique({
      where: { userId },
      include: {
        disabilities: true,
        ciudad: {
          include: {
            departamento: true,
          },
        },
        ciudadPreferida: {
          include: {
            departamento: true,
          },
        },
        sector: true,
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

    return {
      ...postulante,
      applicationsCount: postulante._count.applications,
      savedJobsCount: postulante._count.savedJobs,
    };
  }

  async updateProfile(userId: string, dto: UpdatePostulanteDto) {
    const { disabilityIds, ciudadId, ciudadPreferidaId, sectorId, ...rest } = dto;

    const data: any = {
      ...Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined),
      ),
    };

    if (ciudadId !== undefined) {
      data.ciudadId = ciudadId || null; 
    }
    if (ciudadPreferidaId !== undefined) {
      data.ciudadPreferidaId = ciudadPreferidaId || null;
    }
    if (sectorId !== undefined) {
      data.sectorId = sectorId || null;
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
        ciudad: { include: { departamento: true } },
        ciudadPreferida: { include: { departamento: true } },
        sector: true,
        user: { select: { id: true, email: true } },
      },
    });

    return postulante;
  }

  async uploadFile(userId: string, file: MulterFile, type: FileType) {
    const current = await this.prisma.postulante.findUnique({
      where: { userId },
      select: { cvPublicId: true, fotoPerfilPublicId: true },
    });

    const folder = type === FileType.CV ? 'suma/cvs' : 'suma/fotos-perfil';
    const resourceType = type === FileType.CV ? 'raw' : 'auto';
    const result = await this.cloudinary.uploadFile(file, folder, resourceType);
    const isCv = type === FileType.CV;

    const downloadName = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const url = isCv
      ? `${result.secure_url}?dl=${downloadName}`
      : result.secure_url;

    const updateData = isCv
      ? { cvUrl: url, cvPublicId: result.public_id }
      : { fotoPerfil: url, fotoPerfilPublicId: result.public_id };

    const oldPublicId = isCv ? current?.cvPublicId : current?.fotoPerfilPublicId;
    if (oldPublicId) {
      try {
        await this.cloudinary.destroyFile(oldPublicId);
      } catch (e) {
        console.warn('No se pudo eliminar archivo anterior:', e.message);
      }
    }

    const postulante = await this.prisma.postulante.update({
      where: { userId },
      data: updateData,
      include: {
        disabilities: true,
        user: { select: { id: true, email: true } },
      },
    });

    return {
      url,
      publicId: result.public_id,
      type,
      postulante,
    };
  }

  async getJobOffers(filters: {
    modality?: string;
    sectorId?: string;
    ciudadId?: string;
    departamentoId?: string;
    disabilityId?: string;
    search?: string;
  }) {
    const where: any = { isActive: true };

    if (filters.search) {
      where.OR = [
        { titulo: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } },
        { empresa: { razonSocial: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    if (filters.modality) where.modalidad = filters.modality;
    if (filters.sectorId) where.sectorId = filters.sectorId;
    if (filters.ciudadId) where.ciudadId = filters.ciudadId;
    if (filters.departamentoId) {
      where.ciudad = { departamentoId: filters.departamentoId };
    }
    if (filters.disabilityId) {
      where.disabilities = { some: { id: filters.disabilityId } };
    }

    return this.prisma.jobOffer.findMany({
      where,
      include: {
        empresa: { select: { razonSocial: true, isVerified: true, logoUrl: true } },
        disabilities: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}