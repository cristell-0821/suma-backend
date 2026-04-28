// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostulantesModule } from './postulantes/postulantes.module';
import { EmpresasModule } from './empresas/empresas.module';
import { JobOffersModule } from './job-offers/job-offers.module';
import { ApplicationsModule } from './applications/applications.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DisabilitiesModule } from './disabilities/disabilities.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PostulantesModule,
    EmpresasModule,
    JobOffersModule,
    ApplicationsModule,
    AdminModule,
    DisabilitiesModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}