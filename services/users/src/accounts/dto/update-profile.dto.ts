import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Language } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(Language) language?: Language;
}
