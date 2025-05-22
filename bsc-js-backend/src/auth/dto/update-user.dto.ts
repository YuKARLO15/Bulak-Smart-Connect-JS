import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating user information (citizen)
 * @class UpdateUserDto
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Username', example: 'john_doe' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'User password (min 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Robert' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

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
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Complete address',
    example: '123 Main St, San Ildefonso, Bulacan',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

/**
 * DTO for admin to update any user
 * @class AdminUpdateUserDto
 */
export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Default role ID for the user',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  defaultRoleId?: number;

  @ApiPropertyOptional({
    description: 'Array of role IDs to assign to the user',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  roleIds?: number[];
}
