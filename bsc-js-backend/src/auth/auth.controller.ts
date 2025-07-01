import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AuthenticatedUser } from './jwt.strategy';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OTPService } from '../services/otp.service';
import { EmailService } from '../services/email.service';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService, 
    private emailService: EmailService, 
  ) {}

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
  async register(@Body() createUserDto: RegisterDto) {
    try {
      // First verify OTP if email verification is enabled
      if (createUserDto.email && createUserDto.otp) {
        const isOtpValid = await this.otpService.verifyOTP(
          createUserDto.email,
          createUserDto.otp,
          'verification',
        );

        if (!isOtpValid) {
          throw new BadRequestException('Invalid or expired OTP');
        }
      }

      const result = await this.authService.register(createUserDto);

      // Send welcome email
      if (createUserDto.email) {
        await this.emailService.sendApplicationNotification(
          createUserDto.email,
          'Welcome!',
          'Account Created',
          'Welcome to Bulak LGU Smart Connect',
        );
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // Add null check before converting to number
    if (!req.user || req.user.id === undefined || req.user.id === null) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.authService.getProfile(Number(req.user.id));
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
    if (!req.user || req.user.id === undefined || req.user.id === null) {
      throw new UnauthorizedException('Invalid user ID');
    }

    try {
      return await this.authService.updateUserInfo(
        Number(req.user.id),
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
    if (!req.user || req.user.id === undefined || req.user.id === null) {
      throw new UnauthorizedException('Invalid admin ID');
    }

    try {
      return await this.authService.adminUpdateUser(
        Number(req.user.id),
        Number(targetUserId),
        updateUserDto,
      );
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  }

  @Post('send-otp')
  async sendOTP(@Body() sendOtpDto: { email: string; purpose?: string }) {
    try {
      const { email, purpose = 'verification' } = sendOtpDto;

      // Validate email format
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      await this.otpService.generateOTP(email, purpose);

      return {
        success: true,
        message: 'OTP sent successfully',
        email: email,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  @Post('verify-otp')
  async verifyOTP(@Body() verifyOtpDto: { email: string; otp: string; purpose?: string }) {
    try {
      const { email, otp, purpose = 'verification' } = verifyOtpDto;

      const isValid = await this.otpService.verifyOTP(email, otp, purpose);

      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new UnauthorizedException('Invalid or expired OTP');
    }
  }

  // Add password reset endpoints
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    try {
      // Check if user exists
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If this email is registered, you will receive a password reset code',
        };
      }

      await this.otpService.generateOTP(email, 'password_reset');

      return {
        success: true,
        message: 'Password reset code sent to your email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new BadRequestException('Failed to send password reset code');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: { email: string; otp: string; newPassword: string }) {
    try {
      const { email, otp, newPassword } = resetDto;

      // Verify OTP
      const isOtpValid = await this.otpService.verifyOTP(email, otp, 'password_reset');
      if (!isOtpValid) {
        throw new UnauthorizedException('Invalid or expired reset code');
      }

      // Update password
      await this.authService.updatePassword(email, newPassword);

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  @Post('test-otp')
  async testOTP(@Body() { email }: { email: string }) {
    try {
      const otp = await this.otpService.generateOTP(email, 'verification');
      return {
        success: true,
        message: 'OTP generated and sent',
        // Remove this in production - only for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      };
    } catch (error) {
      console.error('Test OTP error:', error);
      throw new BadRequestException('Failed to generate OTP');
    }
  }
}
