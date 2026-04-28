// src/postulantes/postulantes.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PostulantesService } from './postulantes.service';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';
import { UploadFileDto, FileType } from './dto/upload-file.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { MulterFile } from '../types/multer'; 

@Controller('postulantes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PostulantesController {
  constructor(private postulantesService: PostulantesService) {}

  @Get('perfil')
  @Roles(Role.POSTULANTE)
  getProfile(@CurrentUser('userId') userId: string) {
    return this.postulantesService.getProfile(userId);
  }

  @Put('perfil')
  @Roles(Role.POSTULANTE)
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePostulanteDto,
  ) {
    return this.postulantesService.updateProfile(userId, dto);
  }

  @Post('upload')
  @Roles(Role.POSTULANTE)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Solo se permiten archivos PDF, JPG, PNG o WEBP',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: MulterFile,
    @Body() dto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    return this.postulantesService.uploadFile(userId, file, dto.type);
  }

  @Get('ofertas')
  @Roles(Role.POSTULANTE)
  getJobOffers(
    @Query('modality') modality?: string,
    @Query('sector') sector?: string,
    @Query('city') city?: string,
    @Query('disabilityId') disabilityId?: string,
  ) {
    return this.postulantesService.getJobOffers({
      modality,
      sector,
      city,
      disabilityId,
    });
  }
}