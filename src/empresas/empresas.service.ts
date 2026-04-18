import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return empresa;
  }

  async updateProfile(userId: string, dto: UpdateEmpresaDto) {
    const empresa = await this.prisma.empresa.update({
      where: { userId },
      data: dto,
    });

    return empresa;
  }

  async canPostJobs(userId: string): Promise<boolean> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
      select: { isApproved: true },
    });

    return empresa?.isApproved || false;
  }
}