import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'username123' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'newSecurePassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Jr.' })
  @IsString()
  @IsOptional()
  nameExtension?: string;

  @ApiPropertyOptional({ example: '+639123456789' })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    example: [1, 2], 
    description: 'Array of role IDs to assign to the user',
    type: [Number]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Default role ID for the user' 
  })
  @IsNumber()
  @IsOptional()
  defaultRoleId?: number;
}