import { IsString, IsArray, IsEnum, IsOptional, IsInt, IsDateString } from 'class-validator';

enum Modality {
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
  PRESENCIAL = 'PRESENCIAL',
}

export class CreateJobOfferDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsArray()
  @IsString({ each: true })
  requisitos: string[];

  @IsArray()
  @IsString({ each: true })
  funciones: string[];

  @IsEnum(Modality)
  modalidad: Modality;

  @IsString()
  sector: string;

  @IsString()
  ciudad: string;

  @IsInt()
  @IsOptional()
  salarioMin?: number;

  @IsInt()
  @IsOptional()
  salarioMax?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsArray()
  @IsString({ each: true })
  disabilityIds: string[];
}