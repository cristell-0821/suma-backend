import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateEmpresaDto {
  @IsString()
  @IsOptional()
  razonSocial?: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  tamaño?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  sitioWeb?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  nombreContacto?: string;

  @IsString()
  @IsOptional()
  cargoContacto?: string;

  @IsString()
  @IsOptional()
  telefonoContacto?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accommodations?: string[];
}