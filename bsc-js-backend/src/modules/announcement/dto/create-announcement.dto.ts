import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
