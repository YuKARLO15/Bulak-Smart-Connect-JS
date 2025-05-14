import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { sub: number; email: string; roles: string[] };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received:', loginDto);
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error instanceof Error ? error.message : 'Invalid credentials');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Register endpoint hit with data:', registerDto); //Debugging Statement
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // Add null check before converting to number
    if (!req.user || req.user.sub === undefined || req.user.sub === null) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.authService.getProfile(Number(req.user.sub));
  }
}
