import { Module } from '@nestjs/common';
import { PostulantesController } from './postulantes.controller';
import { PostulantesService } from './postulantes.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [PostulantesController],
  providers: [PostulantesService]
})
export class PostulantesModule {}
