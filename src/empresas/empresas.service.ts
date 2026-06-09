import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { FileTypeEmpresa } from './dto/upload-file.dto';
import { MulterFile } from '../types/multer';

@Injectable()
export class EmpresasService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
      include: {
        sector: true,
        ciudad: { 
          include: {
            departamento: true,
          },
        },
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            jobOffers: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return {
      ...empresa,
      jobOffersCount: empresa._count.jobOffers,
    };
  }

  async updateProfile(userId: string, dto: UpdateEmpresaDto) {
    const { sectorId, ciudadId, ...rest } = dto as any;

    const data: any = { ...rest };

    if (sectorId !== undefined) {
      data.sector = sectorId ? { connect: { id: sectorId } } : { disconnect: true };
    }
    if (ciudadId !== undefined) {
      data.ciudad = ciudadId ? { connect: { id: ciudadId } } : { disconnect: true };
    }

    const empresa = await this.prisma.empresa.update({
      where: { userId },
      data,
      include: { 
        sector: true,
        ciudad: {
          include: {
            departamento: true,
          },
        },
      },
    });

    return empresa;
  }

  async canPostJobs(userId: string): Promise<boolean> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
      select: { isVerified: true },
    });
    return empresa?.isVerified || false;
  }

  // ← NUEVO: Upload de archivos (logo y portada)
  async uploadFile(userId: string, file: MulterFile, type: FileTypeEmpresa) {
    const current = await this.prisma.empresa.findUnique({
      where: { userId },
      select: { logoPublicId: true, portadaPublicId: true },
    });

    const folder = type === FileTypeEmpresa.LOGO ? 'suma/logos-empresa' : 'suma/portadas-empresa';
    const result = await this.cloudinary.uploadFile(file, folder, 'auto');

    const isLogo = type === FileTypeEmpresa.LOGO;

    const updateData = isLogo
      ? { logoUrl: result.secure_url, logoPublicId: result.public_id }
      : { portadaUrl: result.secure_url, portadaPublicId: result.public_id };

    // Eliminar archivo anterior si existe
    const oldPublicId = isLogo ? current?.logoPublicId : current?.portadaPublicId;
    if (oldPublicId) {
      try {
        await this.cloudinary.destroyFile(oldPublicId);
      } catch (e) {
        console.warn('No se pudo eliminar archivo anterior:', e.message);
      }
    }

    const empresa = await this.prisma.empresa.update({
      where: { userId },
      data: updateData,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      type,
      empresa,
    };
  }

  async getPublicProfile(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId, isActive: true, isVerified: true },
      select: {
        id: true,
        razonSocial: true,
        descripcion: true,
        logoUrl: true,
        portadaUrl: true,
        sitioWeb: true,
        tamaño: true,
        direccion: true,
        accommodations: true,
        nombreContacto: true,     // ← agrega
        cargoContacto: true,      // ← agrega
        telefonoContacto: true,   // ← agrega
        sector: { select: { nombre: true } },
        ciudad: { select: { nombre: true, departamento: { select: { nombre: true } } } },
        _count: { select: { jobOffers: true } },
        jobOffers: {
          where: { isActive: true },
          select: {
            id: true,
            titulo: true,
            modalidad: true,
            salarioMin: true,
            salarioMax: true,
            createdAt: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!empresa) throw new NotFoundException('Empresa no encontrada');
    return empresa;
  }
}