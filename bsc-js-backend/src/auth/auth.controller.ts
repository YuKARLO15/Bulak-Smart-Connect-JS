import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: { sub: number; email: string; roles: string[] };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            username: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            defaultRole: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received:', loginDto);
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Invalid credentials',
      );
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            username: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            defaultRole: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Register endpoint hit with data:', registerDto); //Debugging Statement
    return this.authService.register(registerDto);
  }
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // Add null check before converting to number
    if (!req.user || req.user.sub === undefined || req.user.sub === null) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.authService.getProfile(Number(req.user.sub));
  }
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Allows a user to update their own profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Add null check before converting to number
    if (!req.user || req.user.sub === undefined || req.user.sub === null) {
      throw new UnauthorizedException('Invalid user ID');
    }

    try {
      return await this.authService.updateUserInfo(
        Number(req.user.sub),
        updateUserDto,
      );
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    }
  }
  @ApiOperation({
    summary: 'Admin update user',
    description:
      "Allows administrators to update any user's information including role assignments",
  })
  @ApiParam({ name: 'userId', description: 'ID of the user to update' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - user or role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email or username already exists',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('admin/update-user/:userId')
  async adminUpdateUser(
    @Request() req: RequestWithUser,
    @Param('userId') targetUserId: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ) {
    // Add null check before converting to number
    if (!req.user || req.user.sub === undefined || req.user.sub === null) {
      throw new UnauthorizedException('Invalid admin ID');
    }

    try {
      return await this.authService.adminUpdateUser(
        Number(req.user.sub),
        Number(targetUserId),
        updateUserDto,
      );
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  }
}
