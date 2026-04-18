import { Module } from '@nestjs/common';
import { PostulantesController } from './postulantes.controller';
import { PostulantesService } from './postulantes.service';

@Module({
  controllers: [PostulantesController],
  providers: [PostulantesService]
})
export class PostulantesModule {}
