import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsArray,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Username (optional, will use email if not provided)',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    example: 'Miguel',
    description: 'User middle name (optional)',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    example: 'John Miguel Doe Jr.',
    description: 'Full name (auto-generated if not provided)',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Jr.',
    description: 'Name extension (e.g., Jr., Sr., III)',
  })
  @IsOptional()
  @IsString()
  nameExtension?: string;

  @ApiPropertyOptional({
    example: '+639123456789',
    description: 'Contact number',
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    example: [2, 3],
    description: 'Array of role IDs to assign to the user',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];

  @ApiPropertyOptional({
    example: 4,
    description: 'Default role ID for the user',
  })
  @IsOptional()
  @IsNumber()
  defaultRoleId?: number;
}
