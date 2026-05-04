import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Modality } from '@prisma/client';

export class UpdateJobOfferDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requisitos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  funciones?: string[];

  @IsEnum(Modality)
  @IsOptional()
  modalidad?: Modality;

  @IsString()
  @IsOptional()
  sectorId?: string;

  @IsString()
  @IsOptional()
  ciudadId?: string; 

  @IsNumber()
  @IsOptional()
  salarioMin?: number;

  @IsNumber()
  @IsOptional()
  salarioMax?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  disabilityIds?: string[];
}