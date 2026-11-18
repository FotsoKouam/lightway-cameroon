import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(['FR', 'EN']) language?: string;
}
