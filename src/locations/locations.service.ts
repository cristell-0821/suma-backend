import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findAllDepartamentos() {
    return this.prisma.departamento.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        ciudades: {
          orderBy: { nombre: 'asc' },
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async findDepartamentoById(id: string) {
    return this.prisma.departamento.findUnique({
      where: { id },
      include: {
        ciudades: {
          orderBy: { nombre: 'asc' },
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async findCiudadesByDepartamento(departamentoId: string) {
    return this.prisma.ciudad.findMany({
      where: { departamentoId },
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        departamentoId: true,
      },
    });
  }
}