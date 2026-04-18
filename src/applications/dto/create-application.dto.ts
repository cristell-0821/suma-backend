import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  jobOfferId: string;

  @IsString()
  @IsOptional()
  mensaje?: string;
}