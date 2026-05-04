import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EmpresasService } from './empresas.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UploadFileEmpresaDto, FileTypeEmpresa } from './dto/upload-file.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { MulterFile } from '../types/multer';

@Controller('empresas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmpresasController {
  constructor(private empresasService: EmpresasService) {}

  @Get('perfil')
  @Roles(Role.EMPRESA)
  getProfile(@CurrentUser('userId') userId: string) {
    return this.empresasService.getProfile(userId);
  }

  @Put('perfil')
  @Roles(Role.EMPRESA)
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateEmpresaDto,
  ) {
    return this.empresasService.updateProfile(userId, dto);
  }

  // ← NUEVO: Upload de logo y portada
  @Post('upload')
  @Roles(Role.EMPRESA)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB para imágenes de empresa
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Solo se permiten imágenes JPG, PNG o WEBP',
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
    @Body() dto: UploadFileEmpresaDto,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!Object.values(FileTypeEmpresa).includes(dto.type)) {
      throw new BadRequestException('Tipo de archivo no válido. Use: logo o portada');
    }

    return this.empresasService.uploadFile(userId, file, dto.type);
  }
}