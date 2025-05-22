import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateQueueDto {
  @IsOptional()
  userId?: number | string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleInitial?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  reasonOfVisit: string;

  @IsString()
  @IsNotEmpty()
  appointmentType: string;

  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;
}
