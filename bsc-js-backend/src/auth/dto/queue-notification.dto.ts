import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class QueueNotificationDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Queue number',
    example: 'WK001',
  })
  @IsString()
  queueNumber: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'position_alert',
    enum: ['position_alert', 'status_update'],
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Queue position (for position alerts)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    description: 'Estimated waiting time',
    example: '10 minutes',
    required: false,
  })
  @IsOptional()
  @IsString()
  estimatedTime?: string;

  @ApiProperty({
    description: 'Queue status (for status updates)',
    example: 'now_serving',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Additional message',
    example: 'Please proceed to the counter',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}