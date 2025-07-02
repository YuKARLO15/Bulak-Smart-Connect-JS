import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class AppointmentNotificationDto {
  @ApiProperty({
    description: 'Email address of the appointment holder',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Appointment number/ID',
    example: 'APPT-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  appointmentNumber: string;

  @ApiProperty({
    description: 'Type of notification to send',
    enum: ['confirmation', 'status_update', 'cancellation', 'reminder'],
    example: 'confirmation',
  })
  @IsString()
  @IsNotEmpty()
  type: 'confirmation' | 'status_update' | 'cancellation' | 'reminder';

  @ApiPropertyOptional({
    description: 'New appointment status (for status updates)',
    example: 'confirmed',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Cancellation reason (for cancellations)',
    example: 'Cancelled by administrator',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Appointment details object',
    type: 'object',
    additionalProperties: true,
  })
  appointmentDetails: {
    type: string;
    date: string;
    time: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}