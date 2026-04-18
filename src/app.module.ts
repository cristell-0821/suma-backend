import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostulantesModule } from './postulantes/postulantes.module';
import { EmpresasModule } from './empresas/empresas.module';
import { JobOffersModule } from './job-offers/job-offers.module';
import { ApplicationsModule } from './applications/applications.module';
import { DisabilitiesModule } from './disabilities/disabilities.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PostulantesModule, EmpresasModule, JobOffersModule, ApplicationsModule, DisabilitiesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
