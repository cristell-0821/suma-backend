import { Module } from '@nestjs/common';
import { EmpresasController, EmpresasPublicController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [EmpresasController, EmpresasPublicController],
  providers: [EmpresasService],
})
export class EmpresasModule {}