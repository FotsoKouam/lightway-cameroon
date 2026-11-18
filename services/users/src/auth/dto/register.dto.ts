import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Language } from '@prisma/client';

export class RegisterDto {
  @IsString() @IsNotEmpty() identifier: string;
  @IsString() @IsNotEmpty() contact: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @MinLength(8) password: string;
  @IsIn(['USER', 'DRIVER']) kind: string;
  @IsOptional() @IsEnum(Language) language?: Language;
}
