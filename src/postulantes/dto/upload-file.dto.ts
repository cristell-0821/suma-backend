// src/postulantes/dto/upload-file.dto.ts
import { IsEnum } from 'class-validator';

export enum FileType {
  CV = 'cv',
  FOTO_PERFIL = 'foto_perfil',
}

export class UploadFileDto {
  @IsEnum(FileType)
  type: FileType;
}