import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('token') token: string) {
    try {
      const decodedToken = await this.authService.verifyToken(token);
      return { user: decodedToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}