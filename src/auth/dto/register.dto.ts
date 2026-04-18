import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum Role {
  POSTULANTE = 'POSTULANTE',
  EMPRESA = 'EMPRESA',
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}