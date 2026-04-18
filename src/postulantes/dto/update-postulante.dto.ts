import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

enum Modality {
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
  PRESENCIAL = 'PRESENCIAL',
}

export class UpdatePostulanteDto {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  cvUrl?: string;

  @IsEnum(Modality)
  @IsOptional()
  modalidadPreferida?: Modality;

  @IsString()
  @IsOptional()
  sectorPreferido?: string;

  @IsString()
  @IsOptional()
  ciudadPreferida?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  disabilityIds?: string[];
}