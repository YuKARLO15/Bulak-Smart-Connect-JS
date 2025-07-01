import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, Length, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Email address to send OTP to',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiPropertyOptional({
    description: 'Purpose of the OTP',
    example: 'verification',
    enum: ['verification', 'password_reset'],
    default: 'verification',
  })
  @IsString()
  @IsOptional()
  purpose?: string = 'verification';
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]{6}$',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @ApiPropertyOptional({
    description: 'Purpose of the OTP verification',
    example: 'verification',
    enum: ['verification', 'password_reset'],
    default: 'verification',
  })
  @IsString()
  @IsOptional()
  purpose?: string = 'verification';
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: '6-digit OTP code received via email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]{6}$',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @ApiProperty({
    description: 'New password (must meet complexity requirements)',
    example: 'NewSecure123!',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsString()
  @Length(8, 100, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain uppercase, lowercase, numbers, and special characters',
    },
  )
  newPassword: string;
}

export class TestOtpDto {
  @ApiProperty({
    description: 'Email address for testing OTP generation',
    example: 'test@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class ApplicationNotificationDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Application ID',
    example: 'APP-001',
  })
  @IsString()
  applicationId: string;

  @ApiProperty({
    description: 'Application status',
    example: 'Approved',
    enum: ['Pending', 'Approved', 'Rejected', 'Ready for Pickup'],
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Type of application',
    example: 'Birth Certificate',
  })
  @IsString()
  applicationType: string;
}