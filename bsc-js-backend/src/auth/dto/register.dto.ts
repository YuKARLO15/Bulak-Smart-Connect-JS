import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for user registration
 * @class RegisterDto
 */

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Username for login',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    description: 'User middle name (optional)',
    example: 'Robert',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Full name (auto-generated)',
    example: 'John Robert Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Name extension (e.g., Jr., III)',
    example: 'Jr.',
  })
  @IsString()
  @IsOptional()
  nameExtension?: string;

  @ApiPropertyOptional({
    description: 'Contact number',
    example: '09123456789',
  })
  @IsString()
  contactNumber?: string;
}
