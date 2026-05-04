import { IsEnum } from 'class-validator';

export enum FileTypeEmpresa {
  LOGO = 'logo',
  PORTADA = 'portada',
}

export class UploadFileEmpresaDto {
  @IsEnum(FileTypeEmpresa, {
    message: 'Tipo no válido. Use: logo o portada',
  })
  type: FileTypeEmpresa;
}