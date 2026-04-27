// src/postulantes/dto/update-postulante.dto.ts

import { IsString, IsOptional, IsArray, IsEnum, IsInt, IsUrl, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
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

  // ← FALTABA ESTO
  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

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
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @IsInt()
  salarioEsperado?: number | null;

  @IsOptional()
  @ValidateIf(o => o.linkedin !== '' && o.linkedin !== null && o.linkedin !== undefined)
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @ValidateIf(o => o.portfolio !== '' && o.portfolio !== null && o.portfolio !== undefined)
  @IsUrl()
  portfolio?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

  @IsOptional()
  @ValidateIf(o => o.modalidadPreferida !== '' && o.modalidadPreferida !== null && o.modalidadPreferida !== undefined)
  @IsEnum(Modality)
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