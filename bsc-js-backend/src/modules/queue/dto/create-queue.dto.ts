import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateQueueDto {
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

  @IsOptional()
  userId?: number;
}