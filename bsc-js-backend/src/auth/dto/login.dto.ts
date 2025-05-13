import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for user login
 * @class LoginDto
 */

export class LoginDto {
  @IsNotEmpty()
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
