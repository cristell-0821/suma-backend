import { IsString, IsOptional, IsArray, IsEnum,IsInt, IsUrl } from 'class-validator';

import { Modality } from '@prisma/client';

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

  @IsOptional()
  @IsString()
  sobreMi?: string;

  @IsOptional()
  @IsInt()
  salarioEsperado?: number;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  portfolio?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

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