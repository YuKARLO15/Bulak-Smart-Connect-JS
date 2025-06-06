import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'username123' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'Jr.' })
  @IsString()
  @IsOptional()
  nameExtension?: string;

  @ApiPropertyOptional({ example: '+639123456789' })
  @IsString()
  @IsOptional()
  contactNumber?: string;

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