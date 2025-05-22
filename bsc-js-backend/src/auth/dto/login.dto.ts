import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user login
 * @class LoginDto
 */

export class LoginDto {
  @ApiProperty({
    description: 'Email or username for login',
    example: 'test@example.com',
  })
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty({
    description: 'Test User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
